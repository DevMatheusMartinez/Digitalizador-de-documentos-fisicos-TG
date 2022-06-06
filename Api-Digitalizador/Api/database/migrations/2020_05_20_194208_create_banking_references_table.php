<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBankingReferencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('banking_references', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->string('bank_code')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('agency')->nullable();
            $table->string('account')->nullable();
            $table->string('account_type')->nullable();
            $table->date('opening_date')->nullable();
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
        Schema::dropIfExists('banking_references');
    }
}
