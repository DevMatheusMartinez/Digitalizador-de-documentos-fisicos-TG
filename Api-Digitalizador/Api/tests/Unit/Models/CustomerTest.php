<?php

namespace Tests\Unit\Models;

use App\GlobalScopes\LoggedTenant;
use App\Models\Address;
use App\Models\BankingReference;
use App\Models\Contact;
use App\Models\Customer;
use App\Models\Income;
use App\Models\Log;
use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        Carbon::setTestNow();
        parent::setUp();
    }

    public function testItCustomerHasMaritalStatusConstants()
    {
        $this->assertEquals('Casado(a)', Customer::MARRIED);
        $this->assertEquals('Solteiro(a)', Customer::NOTMARRIED);
        $this->assertEquals('Divorciado(a)', Customer::DIVORCED);
        $this->assertEquals('Viúvo(a)', Customer::WIDOWER);
        $this->assertEquals('Separado(a)', Customer::SEPARETED);
    }

    public function testItCustomerHasGenderConstants()
    {
        $this->assertEquals('masculino', Customer::MALE);
        $this->assertEquals('feminino', Customer::FEMALE);
    }

    public function testItCustomerBelongsToTenant()
    {
        $customer = Customer::factory()->make(['tenant_uuid' => Tenant::factory()->create()->uuid]);
        $this->assertInstanceOf(
            Tenant::class,
            $customer->tenant
        );
    }

    public function testItCustomerMorphManyContacts()
    {
        $customer = Customer::factory()->create();
        $customer->contacts()->saveMany(Contact::factory()->count(2)->make());
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $customer->contacts);
        $customer->contacts->each(function ($contact) {
            $this->assertInstanceOf(
                Contact::class,
                $contact
            );
        });
    }

    public function testItCustomerMorphManyLogsCustomer()
    {
        $customer = Customer::factory()->create();
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $customer->logs);
        $customer->logs->each(function ($log) {
            $this->assertInstanceOf(
                Log::class,
                $log
            );
        });
    }

    public function testItCustomerMorphOneAddress()
    {
        $customer = Customer::factory()->create();
        $customer->address()->save(Address::factory()->make());
        $this->assertInstanceOf(
            Address::class,
            $customer->address
        );
    }

    public function testItCustomerHasManyBankingReferences()
    {
        $customer = Customer::factory()->create();
        $customer->bankingReferences()->saveMany(BankingReference::factory()->count(2)->make());
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $customer->bankingReferences);
        $customer->bankingReferences->each(function ($bankingReference) {
            $this->assertInstanceOf(
                BankingReference::class,
                $bankingReference
            );
        });
    }

    public function testItCustomerHasManyIncomes()
    {
        $customer = Customer::factory()->create();
        $customer->incomes()->saveMany(Income::factory()->count(2)->make());
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $customer->incomes);
        $customer->incomes->each(function ($income) {
            $this->assertInstanceOf(
                Income::class,
                $income
            );
        });
    }

    public function testItCanFilterCustomerByName()
    {
        $search = 'Robervalson';
        $tenant = Tenant::factory()->create();
        Customer::factory()->times(2)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedCustomers[] = Customer::factory()->create([
            'name' => 'João '.$search,
            'tenant_uuid' => $tenant->uuid,
        ]);
        $expectedCustomers[] = Customer::factory()->create([
            'name' => $search.' Carlos',
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertDatabaseCount('customers', 4);
        $this->assertCount(2, Customer::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get());
        $this->assertEquals(
            collect($expectedCustomers)->pluck('uuid'),
            Customer::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get()->pluck('uuid')
        );
    }

    public function testItCanFilterCustomerByCpfCnpj()
    {
        $cpfCnpj = '553.977.210-50';
        $tenant = Tenant::factory()->create();
        Customer::factory()->times(2)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedCustomer = Customer::factory()->create([
            'cpf_cnpj' => $cpfCnpj,
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertDatabaseCount('customers', 3);
        $this->assertCount(1, Customer::withoutGlobalScope(LoggedTenant::class)->applyFilters($cpfCnpj)->get());
        $this->assertEquals(
            [$expectedCustomer->uuid],
            Customer::withoutGlobalScope(LoggedTenant::class)->applyFilters($cpfCnpj)->get()->pluck('uuid')->toArray()
        );
    }

    public function testItCanFilterCustomerByRg()
    {
        $rg = '38.240.682-5';
        $tenant = Tenant::factory()->create();
        Customer::factory()->times(2)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedCustomer = Customer::factory()->create([
            'rg' => $rg,
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertDatabaseCount('customers', 3);
        $this->assertCount(1, Customer::withoutGlobalScope(LoggedTenant::class)->applyFilters($rg)->get());
        $this->assertEquals(
            [$expectedCustomer->uuid],
            Customer::withoutGlobalScope(LoggedTenant::class)->applyFilters($rg)->get()->pluck('uuid')->toArray()
        );
    }

    public function testItCanOrderingAscCustomerByAnAttribute()
    {
        $attribute = 'name';
        $direction = 'ASC';
        $tenant = Tenant::factory()->create();
        $customer = Customer::factory()->times(5)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(
            $customer->sortBy($attribute)->pluck($attribute)->toArray(),
            Customer::withoutGlobalScope(LoggedTenant::class)->applyOrdering($attribute, $direction)->get()->pluck($attribute)->toArray());
    }

    public function testItCanOrderingDescCustomerByAnAttribute()
    {
        $attribute = 'email';
        $direction = 'DESC';
        $tenant = Tenant::factory()->create();
        $customer = Customer::factory()->times(5)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(
            $customer->sortByDesc($attribute)->pluck($attribute)->toArray(),
            Customer::withoutGlobalScope(LoggedTenant::class)->applyOrdering($attribute, $direction)->get()->pluck($attribute)->toArray());
    }

    public function testItCanOrderingDescCustomerByCreatedAtWhenNotReceivedAttribute()
    {
        $tenant = Tenant::factory()->create();
        $customer = Customer::factory()->times(5)->create([
            'tenant_uuid' => $tenant->uuid,
            'created_at' => now()->subMinutes(rand(1, 1000)),
        ]);

        $this->assertEquals(
            $customer->sortBy('created_at')->pluck('created_at')->toArray(),
            Customer::withoutGlobalScope(LoggedTenant::class)->applyOrdering(null, null)->get()->pluck('created_at')->toArray());
    }
}
