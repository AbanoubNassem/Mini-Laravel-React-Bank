<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Password;
use Tymon\JWTAuth\Facades\JWTAuth;
use Validator;

class APIAuth extends Controller
{
    public function index()
    {

    }


    public function create(Request $request)
    {
        //	$this->middleware( 'guest' );


        $validated = $request->validate([
            'name' => 'required|string|regex:/^[a-zA-Z0-9_]{3,255}$/',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

//        return response()->json( $validated, 201 );

        $validated['password'] = password_hash($validated['password'], PASSWORD_DEFAULT);
        $validated['account_id'] = random_int(100000, 100000 * 1000);
        $validated['balance'] = random_int(500, 50000); //TODO:: delete this, for demo porpoises

        $user = User::create($validated);

        return response()->json(
            [
                'user' => User::find($user->id),
                'access_token' => JWTAuth::fromUser($user)
            ], 201);
    }

    public function Login()
    {
        $validated = \request()->validate([
            'email' => 'required|email|max:255|exists:users,email',
            'password' => 'required|min:6',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if ($user && password_verify($validated['password'], $user->password)) {
            return response()->json(['user' => $user, 'access_token' => JWTAuth::fromUser($user)], 201);
        }

        return response()->json(['message' => 'Invalid Credentials!'], 500);
    }


    public function ForgotPassword()
    {
        $validator = Validator::make(\request()->toArray(), ['email' => 'required|email']);

        if ($validator->fails()) {
            return response()->json($validator->messages(), 400);
        }

        $response = Password::broker()->sendResetLink(
            \request()->only('email')
        );

        return $response == Password::RESET_LINK_SENT
            ? response()->json()
            : response()->json($response, 400);
    }


    public function RestPassword(Request $request)
    {
        $validator = Validator::make($request->toArray(),
            [
                'token' => 'required',
                'email' => 'required|email',
                'password' => 'required|confirmed|min:6',
            ]
        );

        if ($validator->fails()) {
            return response()->json($validator->messages(), 400);
        }


        $response = Password::broker()->reset(
            $this->credentials($request), function ($user, $password) {
            $this->resetPassword($user, $password);
        }
        );


        return $response == Password::PASSWORD_RESET
            ? response()->json()
            : response()->json($response, 400);

    }

    protected function credentials(Request $request)
    {
        return $request->only(
            'email', 'password', 'password_confirmation', 'token'
        );
    }

    protected function resetPassword($user, $password)
    {
        $user->forceFill([
            'password' => bcrypt($password),
            'remember_token' => Str::random(60),
        ])->save();

//        $this->guard()->login($user);
    }
}
