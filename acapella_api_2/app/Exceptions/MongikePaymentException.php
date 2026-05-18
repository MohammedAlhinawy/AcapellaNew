<?php

namespace App\Exceptions;

use Exception;

class MongikePaymentException extends Exception
{
    protected $code;

    public function __construct(string $message = 'Payment failed', int $code = 422, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $this->code = $code;
    }

    public function render()
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'error_code' => 'PAYMENT_FAILED',
        ], $this->code);
    }
}
