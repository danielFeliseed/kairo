<?php

namespace App\Enums;

enum Status: string
{
    case Submitted = 'Submitted';
    case Reviewed = 'Reviewed';

    public static function getStatuses(): array
    {
        return array_map(fn (Status $status) => $status->value, Status::cases());
    }

    public static function getStatusLabels(): array
    {
        return [
            self::Submitted->value => '先生からのコメントまち',
            self::Reviewed->value => '先生が見たよ！',
        ];
    }

    public static function getStatusColors(): array
    {
        return [
            self::Submitted->value => 'bg-yellow-100 text-yellow-700 border border-yellow-300',
            self::Reviewed->value => 'bg-green-100 text-green-700 border border-green-300',
        ];
    }
}