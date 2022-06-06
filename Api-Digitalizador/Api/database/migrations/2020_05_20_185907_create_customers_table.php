<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->string('name')->index();
            $table->date('birthday')->nullable()->index();
            $table->string('cpf_cnpj', 20)->nullable()->index();
            $table->string('rg')->nullable()->index();
            $table->string('rg_org')->nullable();
            $table->string('rg_uf')->nullable();
            $table->date('rg_date')->nullable();
            $table->string('ie')->nullable();
            $table->string('email')->nullable()->index();
            $table->string('nationality')->nullable();
            $table->string('naturalness')->nullable();
            $table->string('naturalness_uf')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('mother')->nullable();
            $table->string('father')->nullable();
            $table->boolean('spouse_on');
            $table->string('spouse')->nullable()->index();
            $table->date('spouse_birthday')->nullable();
            $table->string('spouse_cpf', 20)->nullable()->index();
            $table->string('spouse_rg')->nullable()->index();
            $table->string('spouse_rg_org')->nullable();
            $table->string('spouse_rg_uf')->nullable();
            $table->date('spouse_rg_date')->nullable();
            $table->string('spouse_gender')->nullable();
            $table->string('spouse_nationality')->nullable();
            $table->string('spouse_naturalness')->nullable();
            $table->string('spouse_naturalness_uf')->nullable();
            $table->string('spouse_email')->nullable()->index();
            $table->string('spouse_mother')->nullable();
            $table->string('spouse_father')->nullable();
            $table->uuid('tenant_uuid')->nullable();
            $table->foreign('tenant_uuid')->references('uuid')->on('tenants');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customers');
    }
}
