<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIncomesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incomes', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->string('occupation')->nullable();
            $table->string('company')->nullable();
            $table->string('cnpj', 20)->nullable();
            $table->string('role')->nullable();
            $table->string('value')->nullable();
            $table->string('start_date')->nullable();
            $table->boolean('spouse')->default(false);
            $table->uuid('customer_uuid')->nullable();
            $table->foreign('customer_uuid')->references('uuid')->on('customers');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('incomes');
    }
}
