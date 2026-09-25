<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FormSubmissionController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\'-]+$/u'],
            'last_name' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\'-]+$/u'],
            'zip_code' => ['required', 'string', 'max:12', 'regex:/^[A-Za-z0-9\s-]{3,12}$/'],
            'phone_number' => ['required', 'string', 'max:20', 'regex:/^[0-9+()\s-]{7,20}$/'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        $submittedAt = now();
        $zipCode = trim($data['zip_code']);
        $fakeIp = FormSubmission::generateFakeUsIp($zipCode);

        $submission = FormSubmission::create([
            'form_id' => FormSubmission::generateFormId(),
            'verification_code' => FormSubmission::generateVerificationCode(),
            'first_name' => trim($data['first_name']),
            'last_name' => trim($data['last_name']),
            'generated_email' => FormSubmission::generateFakeEmail($data['first_name'], $data['last_name']),
            'zip_code' => $zipCode,
            'phone_number' => trim($data['phone_number']),
            'ip_address' => $request->ip(),
            'fake_ip_address' => $fakeIp['ip'],
            'ip_location' => $fakeIp['location'],
            'submitted_at' => $submittedAt,
        ]);

        return response()->json([
            'message' => 'Form submitted successfully.',
            'data' => $submission,
        ], 201);
    }

    public function index(Request $request)
    {
        $query = FormSubmission::query();

        if ($search = trim((string) $request->query('q', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('form_id', 'like', "%{$search}%")
                    ->orWhere('verification_code', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('generated_email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhere('zip_code', 'like', "%{$search}%");
            });
        }

        $submissions = $query->orderByDesc('submitted_at')->paginate(15);

        return response()->json($submissions);
    }

    public function show(string $formId)
    {
        $submission = FormSubmission::where('form_id', $formId)
            ->orWhere('verification_code', $formId)
            ->first();

        if (! $submission) {
            return response()->json([
                'message' => 'No submission found for that ID.',
            ], 404);
        }

        return response()->json(['data' => $submission]);
    }
}
