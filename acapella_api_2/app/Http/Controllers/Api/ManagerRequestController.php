<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ManagerRequestResource;
use App\Mail\ManagerCredentialsMail;
use App\Models\ManagerRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ManagerRequestController extends Controller
{
    /**
     * POST /api/manager-requests
     * Public: submit a request to become a choir manager.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name'  => 'required|string|max:150',
            'email'      => 'required|email|max:255|unique:manager_requests,email|unique:users,email',
            'phone'      => 'nullable|string|max:30',
            'choir_name' => 'required|string|max:150',
            'location'   => 'required|string|max:100',
            'motivation' => 'required|string|min:20',
            'experience' => 'nullable|string',
        ]);

        $managerRequest = ManagerRequest::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ombi lako limepokelewa. Utajulishwa kwa barua pepe.',
            'data' => new ManagerRequestResource($managerRequest),
        ], 201);
    }

    /**
     * GET /api/admin/manager-requests
     */
    public function index(Request $request): JsonResponse
    {
        $query = ManagerRequest::with(['reviewer', 'createdUser'])->latest();

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $requests = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => ManagerRequestResource::collection($requests)->response()->getData(true),
        ]);
    }

    /**
     * GET /api/admin/manager-requests/{managerRequest}
     */
    public function show(ManagerRequest $managerRequest): JsonResponse
    {
        $managerRequest->load(['reviewer', 'createdUser']);

        return response()->json([
            'success' => true,
            'data' => new ManagerRequestResource($managerRequest),
        ]);
    }

    /**
     * PUT /api/admin/manager-requests/{managerRequest}
     * Update status: approved | rejected | pending.
     * On approval, create a user with role choir_manager and email credentials.
     */
    public function update(Request $request, ManagerRequest $managerRequest): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        $authUser = $request->user();

        if ($validated['status'] === 'approved' && !$managerRequest->isApproved()) {
            // Create user account with random password
            $plainPassword = Str::random(10);

            $user = User::create([
                'name' => $managerRequest->full_name,
                'email' => $managerRequest->email,
                'password' => Hash::make($plainPassword),
                'role' => 'choir_manager',
            ]);

            $managerRequest->created_user_id = $user->id;

            // Send credentials via email
            try {
                Mail::to($user->email)->send(
                    new ManagerCredentialsMail(
                        $user->name,
                        $user->email,
                        $plainPassword,
                        $managerRequest->choir_name,
                    )
                );
            } catch (\Exception $e) {
                // Log but don't fail — admin can resend manually
                \Log::warning('Failed to send manager credentials email: ' . $e->getMessage());
            }
        }

        $managerRequest->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? $managerRequest->admin_notes,
            'reviewed_by' => $authUser->id,
            'reviewed_at' => now(),
        ]);

        $managerRequest->load(['reviewer', 'createdUser']);

        return response()->json([
            'success' => true,
            'message' => 'Hali ya ombi imebadilishwa.',
            'data' => new ManagerRequestResource($managerRequest),
        ]);
    }

    /**
     * DELETE /api/admin/manager-requests/{managerRequest}
     */
    public function destroy(ManagerRequest $managerRequest): JsonResponse
    {
        $managerRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ombi limefutwa.',
        ]);
    }
}
