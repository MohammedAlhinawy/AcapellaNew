<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FeedbackResource;
use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    /**
     * POST /api/feedbacks
     * Authenticated users (listener / choir_manager) submit feedback.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:bug,feature,general,complaint,praise',
            'subject'  => 'required|string|max:200',
            'message'  => 'required|string|min:10',
            'rating'   => 'nullable|integer|min:1|max:5',
        ]);

        $feedback = Feedback::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        $feedback->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Asante kwa maoni yako!',
            'data' => new FeedbackResource($feedback),
        ], 201);
    }

    /**
     * GET /api/feedbacks/mine
     */
    public function mine(Request $request): JsonResponse
    {
        $feedbacks = Feedback::with('responder')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => FeedbackResource::collection($feedbacks)->response()->getData(true),
        ]);
    }

    /**
     * GET /api/admin/feedbacks
     */
    public function index(Request $request): JsonResponse
    {
        $query = Feedback::with(['user', 'responder'])->latest();

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        $feedbacks = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => FeedbackResource::collection($feedbacks)->response()->getData(true),
        ]);
    }

    /**
     * GET /api/admin/feedbacks/{feedback}
     */
    public function show(Feedback $feedback): JsonResponse
    {
        $feedback->load(['user', 'responder']);

        return response()->json([
            'success' => true,
            'data' => new FeedbackResource($feedback),
        ]);
    }

    /**
     * PUT /api/admin/feedbacks/{feedback}
     */
    public function update(Request $request, Feedback $feedback): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:new,in_review,resolved,closed',
            'admin_response' => 'nullable|string',
        ]);

        $update = ['status' => $validated['status']];

        if (!empty($validated['admin_response'])) {
            $update['admin_response'] = $validated['admin_response'];
            $update['responded_by'] = $request->user()->id;
            $update['responded_at'] = now();
        }

        $feedback->update($update);
        $feedback->load(['user', 'responder']);

        return response()->json([
            'success' => true,
            'message' => 'Maoni yamesasishwa.',
            'data' => new FeedbackResource($feedback),
        ]);
    }

    /**
     * DELETE /api/admin/feedbacks/{feedback}
     */
    public function destroy(Feedback $feedback): JsonResponse
    {
        $feedback->delete();

        return response()->json([
            'success' => true,
            'message' => 'Maoni yamefutwa.',
        ]);
    }
}
