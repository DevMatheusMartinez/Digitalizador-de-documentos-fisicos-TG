<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => 'api'], function () {
    Route::post('login', ['uses'=>'AuthController@login', 'as' => 'login']);
    Route::post('logout', ['uses'=>'AuthController@logout', 'as' => 'logout']);
    Route::post('refresh', ['uses'=>'AuthController@refresh', 'as' => 'refresh']);
    Route::post('me', ['uses'=>'AuthController@me', 'as' => 'me']);
    Route::post('tenants', ['uses'=>'TenantController@store', 'as' => 'tenants.store']);
    Route::get("tenants/isExistCNPJ/{cnpj}", ['uses' => 'TenantController@isExistCNPJ', 'as' => '.isExistCNPJ']);

    Route::post('forgot-password', ['uses' => 'AuthController@forgotPassword', 'as' => 'forgot']);
    Route::post('verification', ['uses' => 'AuthController@verification', 'as' => 'verification']);
    Route::post('{user}/new-password', ['uses' => 'AuthController@newPassword', 'as' => 'new-password']);
});

Route::group(['middleware' => ['auth:api']], function () {

    Route::group(['prefix' => 'customers/', 'as' => 'customers'], function () {
        Route::get('/', [
            'uses' => 'CustomerController@index',
            'middleware' => 'permissions:customers.index',
            'as' => '.index',
        ]);
        Route::post('/', [
            'uses' => 'CustomerController@store',
            'middleware' => 'permissions:customers.store',
            'as' => '.store',
        ]);
        Route::get('/{customer}', [
            'uses' => 'CustomerController@show',
            'middleware' => 'permissions:customers.index|customers.update',
            'as' => '.show',
        ]);
        Route::get('/cpfcnpj/{cpf_cnpj}', [
            'uses' => 'CustomerController@showCpfCnpj',
            'middleware' => 'permissions:customers.index|customers.update',
            'as' => '.cpfCnpj.show',
        ]);
        Route::get('/name/{name}', [
            'uses' => 'CustomerController@showName',
            'middleware' => 'permissions:customers.index|customers.update',
            'as' => '.name.show',
        ]);
        Route::put('/{customer}', [
            'uses' => 'CustomerController@update',
            'middleware' => 'permissions:customers.update',
            'as' => '.update',
        ]);
        Route::delete('/{customer}', [
            'uses' => 'CustomerController@destroy',
            'middleware' => 'permissions:customers.destroy',
            'as' => '.destroy',
        ]);
        Route::post('/importData', [
            'uses'=>'CustomerController@importData',
        ]);
    });

    Route::group(['prefix' => 'constants/', 'as' => 'constants'], function () {
        Route::get('/banks', ['uses' => 'ConstantsController@banksList', 'as' => '.banksList']);
        Route::get('/manufactures', ['uses' => 'ConstantsController@manufacturesList', 'as' => '.manufacturesList']);
    });

    Route::group(['prefix' => 'tenants', 'as' => 'tenants'], function () {
        Route::put('/{tenant}', ['uses' => 'TenantController@update', 'as' => '.update']);
        Route::get('/tenant/{cnpj}', ['uses' => 'TenantController@show', 'as' => '.show']);
        Route::get('/{tenant}', ['uses' => 'TenantController@showId', 'as' => '.showId']);
        Route::post('/{tenant}/upload-logo', [
            'uses' => 'TenantController@logo',
            'middleware' => 'permissions:tenants.update',
            'as' => '.upload-logo',
        ]);
    });

    Route::group(['prefix' => 'users/', 'as' => 'users'], function () {

        Route::get('/permissions', [
            'uses' => 'UserController@getPermissions',
            'as' => '.permissions',
        ]);

        Route::post('{user}/upload', [
            'uses' => 'UserController@upload',
            'as' => '.upload',
        ]);

        Route::get('/userLogged', [
            'uses' => 'UserController@showUserLogged',
            'as' => '.showUserLogged',
        ]);

        Route::get('/loggedTenant', [
            'uses' => 'UserController@showLoggedTenant',
            'middleware' => 'permissions:users.index|users.update',
            'as' => '.showLoggedTenant',
        ]);

        Route::get('/', [
            'uses' => 'UserController@index',
            'middleware' => 'permissions:users.index',
            'as' => '.index',
        ]);

        Route::get('/{user}', [
            'uses' => 'UserController@show',
            'middleware' => 'permissions:users.index|users.update',
            'as' => '.show',
        ]);

        Route::post('/', [
            'uses' => 'UserController@store',
            'middleware' => 'permissions:users.store',
            'as' => '.store',
        ]);

        Route::put('/{user}', [
            'uses' => 'UserController@update',
            'middleware' => 'permissions:users.update',
            'as' => '.update',
        ]);

        Route::put('/littleEdit/{user}', [
            'uses' => 'UserController@littleUpdate',
            'middleware' => 'permissions:users.update',
            'as' => '.update',
        ]);

        Route::put('/passwordReset/{user}', [
            'uses' => 'UserController@updatePasswordInitial',
            'middleware' => 'permissions:users.update',
            'as' => '.update',
        ]);

        Route::delete('/{user}', [
            'uses' => 'UserController@destroy',
            'middleware' => 'permissions:users.destroy',
            'as' => '.destroy',
        ]);
    });

    Route::group(['prefix' => 'terms/', 'as' => 'terms'], function () {
        Route::get('/', [
            'uses' => 'WarrantyTermController@index',
            'middleware' => 'permissions:terms.index',
            'as' => '.index',
        ]);
        Route::get('/{warrantyTerm}', [
            'uses' => 'WarrantyTermController@show',
            'middleware' => 'permissions:terms.index|terms.update',
            'as' => '.show',
        ]);
        Route::post('/', [
            'uses' => 'WarrantyTermController@store',
            'middleware' => 'permissions:terms.store',
            'as' => '.store',
        ]);
        Route::put('/{warrantyTerm}', [
            'uses' => 'WarrantyTermController@update',
            'middleware' => 'permissions:terms.update',
            'as' => '.update',
        ]);
        Route::delete('/{warrantyTerm}', [
            'uses' => 'WarrantyTermController@destroy',
            'middleware' => 'permissions:terms.destroy',
            'as' => '.destroy',
        ]);
    });
});

