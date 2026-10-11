<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class FormSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_id',
        'verification_code',
        'first_name',
        'last_name',
        'email',
        'generated_email',
        'zip_code',
        'state',
        'trusted_form_cert_url',
        'banana_consent',
        'phone_number',
        'ip_address',
        'user_agent',
        'fake_ip_address',
        'ip_location',
        'submitted_at',
    ];

    /**
     * US state per ZIP3 (first 3 digits of the zip code) range, matching the
     * standard USPS zip prefix assignment used by public zip-lookup tools.
     * Each entry is [minPrefix, maxPrefix, stateAbbreviation].
     */
    private const ZIP3_STATE_RANGES = [
        [6, 9, 'PR'], [10, 27, 'MA'], [28, 29, 'RI'], [30, 38, 'NH'], [39, 49, 'ME'],
        [50, 59, 'VT'], [60, 69, 'CT'], [70, 89, 'NJ'], [100, 149, 'NY'], [150, 196, 'PA'],
        [197, 199, 'DE'], [200, 205, 'DC'], [206, 219, 'MD'], [220, 246, 'VA'], [247, 268, 'WV'],
        [270, 289, 'NC'], [290, 299, 'SC'], [300, 319, 'GA'], [320, 339, 'FL'], [341, 342, 'FL'],
        [344, 344, 'FL'], [346, 347, 'FL'], [349, 349, 'FL'], [350, 369, 'AL'], [370, 385, 'TN'],
        [386, 397, 'MS'], [398, 399, 'GA'], [400, 427, 'KY'], [430, 459, 'OH'], [460, 479, 'IN'],
        [480, 499, 'MI'], [500, 528, 'IA'], [530, 549, 'WI'], [550, 567, 'MN'], [570, 577, 'SD'],
        [580, 588, 'ND'], [590, 599, 'MT'], [600, 629, 'IL'], [630, 658, 'MO'], [660, 679, 'KS'],
        [680, 693, 'NE'], [700, 701, 'LA'], [703, 708, 'LA'], [710, 714, 'LA'], [716, 729, 'AR'],
        [730, 731, 'OK'], [733, 733, 'TX'], [734, 741, 'OK'], [743, 749, 'OK'], [750, 799, 'TX'],
        [800, 816, 'CO'], [820, 831, 'WY'], [832, 838, 'ID'], [840, 847, 'UT'], [850, 865, 'AZ'],
        [870, 884, 'NM'], [885, 885, 'TX'], [889, 898, 'NV'], [900, 961, 'CA'], [967, 968, 'HI'],
        [969, 969, 'GU'], [970, 979, 'OR'], [980, 994, 'WA'], [995, 999, 'AK'],
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'banana_consent' => 'boolean',
    ];

    public static function generateFormId(): string
    {
        do {
            $formId = 'FRM-'.now()->format('Ymd').'-'.now()->format('His').'-'.Str::upper(Str::random(6));
        } while (self::where('form_id', $formId)->exists());

        return $formId;
    }

    public static function generateVerificationCode(): string
    {
        do {
            $code = Str::upper(Str::substr(Str::uuid()->toString(), 0, 8)).'-'.Str::upper(Str::random(4));
        } while (self::where('verification_code', $code)->exists());

        return $code;
    }

    public static function generateFakeEmail(string $firstName, string $lastName): string
    {
        $domain = config('eagle.fake_email_domain');

        $base = Str::of($firstName.$lastName)
            ->lower()
            ->replaceMatches('/[^a-z0-9]+/', '')
            ->value();

        if ($base === '') {
            $base = 'guest';
        }

        do {
            $digits = random_int(0, 1) === 0 ? random_int(10, 99) : random_int(100, 999);
            $candidate = "{$base}{$digits}@{$domain}";
        } while (self::where('generated_email', $candidate)->exists());

        return $candidate;
    }

    /**
     * Generate a fake public-looking US IPv4 address, with the state
     * resolved from the zip code's ZIP3 prefix (matches standard zip
     * lookup tools, e.g. Google's "zip code" results).
     *
     * @return array{ip: string, location: string}
     */
    public static function generateFakeUsIp(string $zipCode): array
    {
        $state = self::stateForZip($zipCode);

        return [
            'ip' => self::randomPublicIp(),
            'location' => $state ? "{$state}, USA" : 'USA',
        ];
    }

    private static function stateForZip(string $zipCode): ?string
    {
        $digits = preg_replace('/[^0-9]/', '', $zipCode);

        if (strlen($digits) < 3) {
            return null;
        }

        $prefix = (int) substr($digits, 0, 3);

        foreach (self::ZIP3_STATE_RANGES as [$min, $max, $state]) {
            if ($prefix >= $min && $prefix <= $max) {
                return $state;
            }
        }

        return null;
    }

    private static function randomPublicIp(): string
    {
        do {
            $octets = [
                random_int(1, 223),
                random_int(0, 255),
                random_int(0, 255),
                random_int(1, 254),
            ];
        } while (
            $octets[0] === 10
            || ($octets[0] === 172 && $octets[1] >= 16 && $octets[1] <= 31)
            || ($octets[0] === 192 && $octets[1] === 168)
            || $octets[0] === 127
            || ($octets[0] === 169 && $octets[1] === 254)
        );

        return implode('.', $octets);
    }
}
