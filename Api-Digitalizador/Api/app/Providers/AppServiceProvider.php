<?php

namespace App\Providers;

use App\Models\Customer;
use App\Models\File;
use App\Models\Import;
use App\Models\Sale;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\WarrantyTerm;
use App\Observers\CustomerObserver;
use App\Observers\FileObserver;
use App\Observers\ImportObserver;
use App\Observers\LogObserver;
use App\Observers\SaleObserver;
use App\Observers\UserObserver;
use App\Observers\VehicleObserver;
use App\Observers\WarrantyTermObserver;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(\Faker\Generator::class, function () {
            return \Faker\Factory::create('pt_BR');
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Relation::morphMap([
            'customer' => 'App\Models\Customer',
            'user' => 'App\Models\User',
            'tenant' => 'App\Models\Tenant',
            'file' => 'App\Models\File',
            'vehicle' => 'App\Models\Vehicle',
            'sale' => 'App\Models\Sale',
            'warranty_term' => 'App\Models\WarrantyTerm',
            'import' => "App\Models\Import"
        ]);

        Customer::observe(CustomerObserver::class);
        Sale::observe(SaleObserver::class);
        User::observe(UserObserver::class);
        Vehicle::observe(VehicleObserver::class);
        WarrantyTerm::observe(WarrantyTermObserver::class);
        File::observe(FileObserver::class);
        Import::observe(ImportObserver::class);

        Customer::observe(LogObserver::class);
        File::observe(LogObserver::class);
        Sale::observe(LogObserver::class);
        Tenant::observe(LogObserver::class);
        User::observe(LogObserver::class);
        Vehicle::observe(LogObserver::class);
    }
}
