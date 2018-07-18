<?php

namespace App\Http\Middleware;

use Auth;
use Closure;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;


class TokenRefresh {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     *
     * @return mixed
     */
    public function handle( $request, Closure $next ) {
        try {
            if ( ! $user = JWTAuth::parseToken()->authenticate() ) {
                return response()->json( [ 'message' => 'Invalid Credentials!' ], 401 );
            }
        } catch ( TokenExpiredException $e ) {
            // If the token is expired, then it will be refreshed and added to the headers
            try {
                $refreshed = JWTAuth::refresh( JWTAuth::getToken() );
                $user      = JWTAuth::setToken( $refreshed )->toUser();
                header( 'Authorization: Bearer ' . $refreshed );
            } catch ( JWTException $e ) {
                return response()->json( [ 'message' => 'Invalid Credentials!' ], 401 );
            }
        } catch ( JWTException $e ) {
            return response()->json( [ 'message' => 'Invalid Credentials!' ], 401 );
        }

        // Login the user instance for global usage
        Auth::login( $user, false );

        return $next( $request );
    }
}
