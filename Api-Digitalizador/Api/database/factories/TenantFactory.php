<?php

namespace Database\Factories;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TenantFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Tenant::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'uuid' => uuid(),
            'name' => $name = $this->faker->company,
            'company_name' => $name . " - " . $this->faker->randomElement(['ME', 'LTDA', 'MEI', 'SA', 'LT']),
            'cnpj' => $this->faker->numerify('##.###.###/####-##'),
            'status' => $this->faker->randomElement([Tenant::ACTIVED, Tenant::BLOCKED, Tenant::TESTING]),
        ];
    }
}
