<?php

namespace Tests\Feature\Login;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Keygen\Keygen;
use Tests\TestCase;

class RecoveryPasswordTest extends TestCase
{
    use RefreshDatabase;

    public function testEmailIsBeingSent()
    {
        $user = User::factory()->create();

        $response = $this->postJson(route('forgot'), [
            'email' => $user->email,
        ]);

        $response->assertOK();
    }

    public function testEmailIsNotBeingSent()
    {
        $response = $this->postJson(route('forgot'), [
            'email' => 'naoexisto@gmail.com',
        ]);

        $response->assertStatus(422);
    }

    public function testIfCodeIsValid()
    {
        $user = User::factory()->create(
            ['code' => Keygen::numeric(6)->generate()]
        );

        $response = $this->postJson(route('verification'), [
            'email' => $user->email,
            'code' => $user->code,
        ]);

        $response->assertJson([
            'data' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function testIfCodeIsInvalid()
    {
        $user = User::factory()->create(
            ['code' => Keygen::numeric(6)->generate()]
        );

        $response = $this->postJson(route('verification'), [
            'email' => $user->email,
            'code' => '111222',
        ]);

        $response->assertStatus(422)->assertJson([
            'errors' => [
                'code' => ['0' => 'O code selecionado não existe.'],
            ],
        ]);
    }

    public function testIfThePasswordIsBeingChanged()
    {
        $user = User::factory()->create();

        $response = $this->postJson(route('new-password', $user->uuid), [
            'password' => '123456',
            'password_confirmation' => '123456',
        ]);

        $response->assertJson([
            'data' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function testIfThePasswordIsNotBeingChangedWithTheUserNotEntered()
    {
        $response = $this->postJson(route('new-password', 'withoutUser'), [
            'password' => '123456',
            'password_confirmation' => '123456',
        ]);

        $response->assertNotFound();
    }

    public function testIfThePasswordIsNotBeingChangedWithTheWrongFields()
    {
        $user = User::factory()->create();

        $response = $this->postJson(route('new-password', $user->uuid), [
            'password' => '123456',
            'password_confirmation' => '123',
        ]);

        $response->assertStatus(422);
    }
}
