<?php

namespace Database\Factories;

use App\Models\BankingReference;
use App\Support\Constants\Banks;
use Illuminate\Database\Eloquent\Factories\Factory;

class BankingReferenceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = BankingReference::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $bank = $this->faker->randomElement(Banks::list());
        return [
            'bank_code' => $bank['code'],
            'bank_name' => $bank['name'],
            'agency' => $this->faker->numberBetween(100,2000),
            'account' => $this->faker->numberBetween(10000,99999),
            'account_type' => $this->faker->randomElement([
                BankingReference::CURRENT,
                BankingReference::SALARY,
                BankingReference::SAVINGS
            ]),
            'opening_date' => $this->faker->date('d/m/Y'),
            'customer_uuid' => $this->faker->uuid,
        ];
    }
}
