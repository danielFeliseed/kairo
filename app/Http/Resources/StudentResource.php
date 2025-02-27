<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'profile_color' => $this->profile_color,
            'streak_count' => $this->streak ? $this->streak->getCurrentStreak() : 0,
            'family_name' => $this->family ? $this->family->name : null,
            // Include other fields as needed
        ];
    }
} 