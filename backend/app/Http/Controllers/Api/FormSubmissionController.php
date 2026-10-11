<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;

class FormSubmissionController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\'-]+$/u'],
            'last_name' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\'-]+$/u'],
            'email' => ['required', 'email', 'max:255'],
            'zip_code' => ['required', 'string', 'max:12', 'regex:/^[A-Za-z0-9\s-]{3,12}$/'],
            'state' => ['required', 'string', 'size:2', 'alpha'],
            'xxTrustedFormCertUrl' => ['nullable', 'string', 'max:2048'],
            'bananaConsent' => ['nullable', 'boolean'],
            'user_agent' => ['nullable', 'string', 'max:1000'],
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
            'email' => trim($data['email']),
            'zip_code' => $zipCode,
            'state' => strtoupper($data['state']),
            'trusted_form_cert_url' => $data['xxTrustedFormCertUrl'] ?? null,
            'banana_consent' => (bool) ($data['bananaConsent'] ?? false),
            'phone_number' => trim($data['phone_number']),
            'ip_address' => $request->ip(),
            'user_agent' => $data['user_agent'] ?? $request->userAgent(),
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
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhere('zip_code', 'like', "%{$search}%");
            });
        }

        if ($state = strtoupper(trim((string) $request->query('state', '')))) {
            $query->where('state', $state);
        }

        if (in_array($request->query('consent'), ['1', '0'], true)) {
            $query->where('banana_consent', $request->query('consent') === '1');
        }

        if (in_array($request->query('has_cert'), ['1', '0'], true)) {
            $request->query('has_cert') === '1'
                ? $query->whereNotNull('trusted_form_cert_url')->where('trusted_form_cert_url', '!=', '')
                : $query->where(function ($q) {
                    $q->whereNull('trusted_form_cert_url')->orWhere('trusted_form_cert_url', '');
                });
        }

        if ($from = $request->query('from')) {
            $query->where('submitted_at', '>=', Carbon::parse($from)->startOfDay());
        }

        if ($to = $request->query('to')) {
            $query->where('submitted_at', '<=', Carbon::parse($to)->endOfDay());
        }

        $submissions = $query->orderByDesc('submitted_at')->paginate(15)->toArray();

        $submissions['stats'] = [
            'total' => FormSubmission::count(),
            'today' => FormSubmission::where('submitted_at', '>=', now()->startOfDay())->count(),
            'with_consent' => FormSubmission::where('banana_consent', true)->count(),
            'with_cert' => FormSubmission::whereNotNull('trusted_form_cert_url')->where('trusted_form_cert_url', '!=', '')->count(),
        ];

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
