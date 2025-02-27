<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthGuard
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::user()->role !== 'teacher') {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
