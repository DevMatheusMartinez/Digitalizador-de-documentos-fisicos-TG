<?php

namespace Tests\Unit;

use App\Models\Contact;
use App\Models\Customer;
use App\Models\Log;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LogCastTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testIfWhenRegisteringANewUserBeforeIsEmptyAndAfterHasData()
    {
        $userAdmin = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);

        $user = User::factory()->make();

        $this->actingAs($userAdmin, $tenant->uuid)->postJson(route('users.store'), [
            'name' => $user->name,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->password,
            'admin' => 1,
        ]);

        $log = Log::first()->toArray()['log'];

        $this->assertEmpty($log->before);

        $this->assertEquals($user->name, $log->after->name);
        $this->assertEquals($user->email, $log->after->email);
    }

    public function testIfEditingAUserBeforeHasOldDataAndAfterHasNewData()
    {
        $userAdmin = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);

        $user = User::factory()->create();
        $tenant->users()->attach($user, ['admin' => false]);

        $this->actingAs($userAdmin, $tenant->uuid)->putJson(route('users.update', $user->uuid), [
            'name' => 'Albert Wesker',
            'email' => 'Umbrella@corporation.com',
            'password' => $user->password,
            'password_confirmation' => $user->password,
            'admin' => 1,
        ]);

        $log = Log::first()->toArray()['log'];

        $this->assertEquals($user->name, $log->before->name);
        $this->assertEquals($user->email, $log->before->email);

        $this->assertEquals('Albert Wesker', $log->after->name);
        $this->assertEquals('Umbrella@corporation.com', $log->after->email);
    }

    public function testIfYouDeleteUserBeforeContainsOldDataAndAfterIsEmpty()
    {
        $userAdmin = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);

        $user = User::factory()->create();
        $tenant->users()->attach($user, ['admin' => false]);

        $this->actingAs($userAdmin, $tenant->uuid)->delete(route('users.destroy', $user->uuid));

        $log = Log::first()->toArray()['log'];
        $this->assertEmpty($log->after);
        $this->assertEquals($log->before->name, $user->name);
        $this->assertEquals($log->before->email, $user->email);
    }

    public function testIfWhenRegisteringANewCustomerBeforeIsEmptyAndAfterHasData()
    {
        $customer = $this->getCustomerStub();
        $userAdmin = User::factory()->create();
        $tenant = Tenant::factory()->create();

        $tenant->users()->attach($userAdmin, ['admin' => true]);

        $this->actingAs($userAdmin, $tenant->uuid)
        ->postJson(route('customers.store'), $customer);

        $log = Log::first()->toArray()['log'];

        $this->assertEmpty($log->before);

        $this->assertEquals($customer['name'], $log->after->name);
        $this->assertEquals($customer['cpf_cnpj'], $log->after->cpf_cnpj);
        $this->assertEquals('11/01/1993', $log->after->birthday);
        $this->assertEquals($customer['rg'], $log->after->rg);
        $this->assertEquals($customer['gender'], $log->after->gender);
        $this->assertEquals($customer['marital_status'], $log->after->marital_status);
    }

    public function testIfEditingACustomerBeforeHasOldDataAndAfterHasNewData()
    {
        $newCustomer = $this->getCustomerStub();
        $userAdmin = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);

        $oldCustomer = Customer::factory()->create([
            'gender' => Customer::FEMALE, 'marital_status' => Customer::SEPARETED, 'tenant_uuid' => $tenant->uuid,
            ]);

        $expectedData = array_merge(
            $newCustomer,
            $this->getContactsStub(),
            $this->getAddressStub(),
            $this->getIncomesStub(),
            $this->getBankingReferencesStub()
        );
        $this->actingAs($userAdmin, $tenant->uuid)
            ->putJson(route('customers.update', $oldCustomer->uuid), $expectedData);

        $log = Log::first()->toArray()['log'];

        $this->assertEquals($oldCustomer['name'], $log->before->name);
        $this->assertEquals($oldCustomer['birthday'], $log->before->birthday);
        $this->assertEquals($oldCustomer['cpf_cnpj'], $log->before->cpf_cnpj);
        $this->assertEquals($oldCustomer['rg'], $log->before->rg);
        $this->assertEquals($oldCustomer['marital_status'], $log->before->marital_status);

        $this->assertEquals($newCustomer['name'], $log->after->name);
        $this->assertEquals($newCustomer['birthday'], $log->after->birthday);
        $this->assertEquals($newCustomer['cpf_cnpj'], $log->after->cpf_cnpj);
        $this->assertEquals($newCustomer['rg'], $log->after->rg);
        $this->assertEquals($newCustomer['marital_status'], $log->after->marital_status);
    }

    public function testIfYouDeleteCustomerBeforeContainsOldDataAndAfterIsEmpty()
    {
        $userAdmin = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);

        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($userAdmin, $tenant->uuid)
            ->delete(route('customers.destroy', $customer->uuid));

        $log = Log::first()->toArray()['log'];

        $this->assertEmpty($log->after);

        $this->assertEquals($customer['name'], $log->before->name);
        $this->assertEquals($customer['birthday'], $log->before->birthday);
        $this->assertEquals($customer['cpf_cnpj'], $log->before->cpf_cnpj);
        $this->assertEquals($customer['rg'], $log->before->rg);
        $this->assertEquals($customer['marital_status'], $log->before->marital_status);
    }

    public function testIfEditingATenantBeforeHasOldDataAndAfterHasNewData()
    {
        $tenant = Tenant::factory()->create();
        $userAdmin = User::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);

        $this->actingAs($userAdmin, $tenant->uuid)->putJson(route('tenants.update', $tenant->uuid), [
            'name' => 'Madruga Veiculos',
            'company_name' => 'Madruga Veiculos LTDA',
            'cnpj' => '51.320.686/0001-39',
        ]);

        $log = Log::first()->toArray()['log'];

        $this->assertEquals($tenant['name'], $log->before->name);
        $this->assertEquals($tenant['company_name'], $log->before->company_name);
        $this->assertEquals($tenant['cnpj'], $log->before->cnpj);

        $this->assertEquals('Madruga Veiculos', $log->after->name);
        $this->assertEquals('Madruga Veiculos LTDA', $log->after->company_name);
        $this->assertEquals('51.320.686/0001-39', $log->after->cnpj);
    }

    private function getCustomerStub(): array
    {
        return [
            'name' => 'Ash Ketchum',
            'cpf_cnpj' => '976.883.270-32',
            'birthday' => '11/01/1993',
            'rg' => '24.465.195-4',
            'gender' => Customer::MALE,
            'marital_status' => Customer::NOTMARRIED,
        ];
    }

    private function getContactsStub(): array
    {
        return [
            'contacts' => [
                [
                    'type' => Contact::CELLPHONE,
                    'contact' => '(11) 99123-4422',
                ],
                [
                    'type' => Contact::TELEPHONE,
                    'contact' => '(11) 3322-1088',
                ],
            ],
        ];
    }

    private function getAddressStub(): array
    {
        return [
            'address' => [
                'zipcode' => '66912-310',
                'address' => 'Avenida F',
                'number' => '321',
                'neighborhood' => 'Mangueiras (Mosqueiro)',
                'city' => 'Belém',
                'uf' => 'PA',
            ],
        ];
    }

    private function getIncomesStub(): array
    {
        return [
            'incomes' => [
                [
                    'occupation' => 'Engenheiro de Sistema',
                    'company' => 'SBC Solution',
                    'cnpj' => '13.691.888/0001-06',
                    'role' => 'Gerente',
                    'value' => '10000',
                    'start_date' => '02/10/2009',
                    'spouse' => false,
                ],
                [
                    'occupation' => 'Biomédica',
                    'company' => 'UNIMED',
                    'cnpj' => '08.353.563/0001-75',
                    'role' => 'Supervisora de Hematologia',
                    'value' => '8000',
                    'start_date' => '04/01/2012',
                    'spouse' => true,
                ],
            ],
        ];
    }

    private function getBankingReferencesStub(): array
    {
        return [
            'banking_references' => [
                [
                    'bank_code' => '001',
                    'agency' => '5223',
                    'account' => '183341-3',
                    'account_type' => 'Corrente',
                    'opening_date' => '03/10/2004',
                ],
                [
                    'bank_code' => '033',
                    'agency' => '8812',
                    'account' => '90112-42',
                    'account_type' => 'Corrente',
                    'opening_date' => '12/03/2011',
                ],
            ],
        ];
    }
}
