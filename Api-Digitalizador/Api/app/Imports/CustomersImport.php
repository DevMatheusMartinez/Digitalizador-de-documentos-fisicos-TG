<?php

namespace App\Imports;

use App\Models\Customer;
use App\Services\BankingReferencesService;
use App\Services\ContactService;
use App\Services\IncomeService;
use DateTime;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Date;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Row;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\RegistersEventListeners;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithEvents;

class CustomersImport implements WithHeadingRow, OnEachRow, SkipsEmptyRows, WithEvents
{
    use Importable, RegistersEventListeners;

    private array $finalizeMessages = [
        "rows" => [],
        "total_success_rows_complete" => 0,
        "total_failed_rows" => 0,
        "total_success_rows_incomplete" => 0,
        "rows_total" => 0,
        "rows_success_complete_percentage" => 0,
        "status" => "concluido"
    ];

    /**
     * @param mixed $gender
     * @return mixed
     */
    public function prepareGender($gender)
    {
        if ($gender && $gender[0] == "m") {
            return 'masculino';
        } else if ($gender && $gender[0] == 'f') {
            return 'feminino';
        }

        return $gender;
    }

    /**
     * @param mixed $maritalStatus
     * @return mixed
     */
    public function prepareMaritalStatus($maritalStatus)
    {
        if ($maritalStatus == "Casado" || $maritalStatus == "Casada" || $maritalStatus == "Casado(a)") {
            return "Casado(a)";
        } else if ($maritalStatus == "Solteiro" || $maritalStatus == "Solteira" || $maritalStatus == "Solteiro(a)") {
            return "Solteiro(a)";
        } else if ($maritalStatus == "Divorciado" || $maritalStatus == "Divorciada" || $maritalStatus == "Divorciado(a)") {
            return "Divorciado(a)";
        } else if (
            $maritalStatus == "Viuvo" || $maritalStatus == "Viúvo" || $maritalStatus == "Viuva" || $maritalStatus == "Viúva" ||
            $maritalStatus == "Viuvo(a)" || $maritalStatus == "Viúvo(a)"
        ) {
            return "Viúvo(a)";
        } else if ($maritalStatus == "Separado" || $maritalStatus == "Separada" || $maritalStatus == "Separado(a)") {
            return "Separado(a)";
        }
        return $maritalStatus;
    }

    /**
     * @param mixed $date
     * @return mixed
     */
    public function prepareDate($date)
    {
        $dateCompare = DateTime::createFromFormat('d/m/y', $date);
        if ($dateCompare !== false) {
            if ($dateCompare->format('d/m/y') == $date) {
                $date = Date::createFromFormat('d/m/y', $date);
                /* @phpstan-ignore-next-line */
                return $date->format('d/m/Y');
            }
        }

        return $date;
    }


    public function prepareForValidation(array $data): array
    {
        $data['gender'] = $this->prepareGender($data['gender']);
        $data['marital_status'] = $this->prepareMaritalStatus($data['marital_status']);
        $data['spouse_gender'] = $this->prepareGender($data['spouse_gender']);
        $data['birthday'] = $this->prepareDate($data['birthday']);
        $data['spouse_birthday'] = $this->prepareDate($data['spouse_birthday']);
        $data['rg_date'] = $this->prepareDate($data['rg_date']);
        $data['spouse_rg_date'] =  $this->prepareDate($data['spouse_rg_date']);
        return $data;
    }

    /**
     * @param array $income
     * @param int $rowIndex
     * @param int $number
     * @return mixed
     */
    public function validateIncome($income, $rowIndex, $number)
    {
        $data = [
            "occupation_$number" => $income['occupation'],
            "company_$number" => $income['company'],
            "cnpj_$number" => $income['cnpj'],
            "role_$number" => $income['role'],
            "value_$number" => $income['value'],
            "start_date_$number" => $this->prepareDate($income['start_date'])
        ];

        return Validator::make(
            $data,
            [
                "occupation_$number" => ["required_with:company_$number, cnpj_$number, role_$number, value_$number, start_date_$number", 'string', 'nullable'],
                "company_$number" => ["required_with:occupation_$number, cnpj_$number, role_$number, value_$number, start_date_$number", 'string', 'nullable'],
                "cnpj_$number" => ["required_with:occupation_$number, company_$number, role_$number, value_$number, start_date_$number", 'cnpj', 'nullable'],
                "role_$number" => ["required_with:occupation_$number, company_$number, cnpj_$number, value_$number, start_date_$number", 'string', 'nullable'],
                "value_$number" => ["required_with:occupation_$number, company_$number, cnpj_$number, role_$number, start_date_$number", 'numeric', 'nullable'],
                "start_date_$number" => ["required_with:occupation_$number, company_$number, cnpj_$number, role_$number, value_$number", 'dateFormat:d/m/Y', 'nullable']
            ],
            [
                "occupation_$number.required_with" => "campo cliente_renda_ocupacao_$number é obrigatório para cadastrar a renda do cliente",
                "occupation_$number.string" => "campo cliente_renda_ocupacao_$number é inválido",
                "company_$number.required_with" => "campo cliente_renda_empresa_$number é obrigatório para cadastrar a renda do cliente",
                "company_$number.string" => "campo cliente_renda_empresa_$number é inválido",
                "cnpj_$number.required_with" => "campo cliente_renda_cnpj_$number é obrigatório para cadastrar a renda do cliente",
                "cnpj_$number.cnpj" => "campo cliente_renda_cnpj_$number é inválido",
                "role_$number.required_with" => "campo cliente_renda_cargo_$number é obrigatório para cadastrar a renda do cliente",
                "role_$number.string" => "campo cliente_renda_cargo_$number é inválido",
                "value_$number.required_with" => "campo cliente_renda_$number é obrigatório para cadastrar a renda do cliente",
                "value_$number.numeric" => "campo cliente_renda_$number é inválido",
                "start_date_$number.required_with" => "campo cliente_renda_inicio_$number é obrigatório para cadastrar a renda do cliente",
                "start_date_$number.date_format" => "campo cliente_renda_inicio_$number deve ser uma data válida"
            ],
        );
    }

    /**
     * @param array $bank
     * @param int $rowIndex
     * @param int $number
     * @return mixed
     */
    public function validateBank($bank, $rowIndex, $number)
    {
        $data = [
            "bank_code_$number" => $bank['bank_code'],
            "agency_$number" => $bank['agency'],
            "account_$number" => $bank['account'],
            "account_type_$number" => $bank['account_type'],
            "opening_date_$number" => $this->prepareDate($bank['opening_date'])
        ];
        return Validator::make(
            $data,
            [
                "bank_code_$number" => ["required_with:agency_$number, account_$number, account_type_$number, opening_date_$number", 'nullable'],
                "agency_$number" => ["required_with:bank_code_$number, account_$number, account_type_$number, opening_date_$number", 'nullable'],
                "account_$number" => ["required_with:bank_code_$number, agency_$number, account_type_$number, opening_date_$number", 'nullable'],
                "account_type_$number" => ["required_with:bank_code_$number, agency_$number, account_$number, opening_date_$number", 'nullable'],
                "opening_date_$number" => ["required_with:bank_code_$number, agency_$number, account_$number, account_type_$number", 'dateFormat:d/m/Y', 'nullable']
            ],
            [
                "bank_code_$number.required_with" => "campo cliente_banco_$number é obrigatório",
                "agency_$number.required_with" => "campo cliente_agencia_$number é obrigatório",
                "account_$number.required_with" => "campo cliente_conta_$number é obrigatório",
                "account_type_$number.required_with" => "campo cliente_tipo_conta_$number é obrigatório",
                "opening_date_$number.required_with" => "campo cliente_banco_abertura_$number é obrigatório",
                "opening_date_$number.date_format" => "campo cliente_banco_abertura_$number deve ser uma data válida",
            ],
        );
    }

    /**
     * @param array $address
     * @param int $rowIndex
     * @return mixed
     */
    public function validateAddress($address, $rowIndex)
    {
        return Validator::make(
            $address,
            [
                'zipcode' => ['required_with:address, city, uf, neighborhood, number', 'nullable'],
                'address' => ['required_with:zipcode, city, uf, neighborhood, number', 'string', 'nullable'],
                'city' => ['required_with:address, city, uf, neighborhood, number', 'string', 'nullable'],
                'uf' => ['required_with:zipcode, city, address, neighborhood, number', 'string', 'nullable'],
                'neighborhood' => ['required_with:zipcode, city, uf, address, number', 'string', 'nullable'],
                'number' => ['required_with:zipcode, city, uf, neighborhood, number', 'numeric', 'nullable'],
            ],
            [
                'zipcode.required_with' => "campo cliente_cep é obrigatório",
                'address.required_with' => "campo cliente_endereco é obrigatorio",
                'address.string' => "campo cliente_endereco é inválido",
                'city.required_with' => "campo cliente_cidade é obrigatório",
                'city.string' => "campo cliente_cidade é inválido",
                'uf.required_with' => "campo cliente_uf é obrigatório",
                'uf.string' => "campo cliente_uf é inválido",
                'neighborhood.required_with' => "campo cliente_bairro é obrigatório",
                'neighborhood.string' => "campo cliente_bairro é inválido",
                'number.required_with' => "campo cliente_numero é obrigatório",
                'number.numeric' => "campo cliente_numero é inválido",
            ]
        );
    }

    public function finalize(object $import): void
    {
        $this->finalizeMessages['rows'] = json_encode($this->finalizeMessages['rows']);
        $import->update($this->finalizeMessages);
    }

    public function onRow(Row $row): void
    {
        $rowIndex = $row->getIndex();
        $rowDataCurrent = [
            "row" => $rowIndex,
            'status' => "",
            'failed_rows' => [],
            'field_not_Entered' => [],
            'failed_rows_total' => 0,
            'field_not_Entered_total' => 0
        ];
        $contacts = [];
        $incomes = [];
        $banks = [];
        $address = [];
        $errorsAddress = [];
        $errorsBankAll = [];
        $errorsIncomeAll = [];
        ++$this->finalizeMessages['rows_total'];

        $data = [
            'name' => $row['cliente_nome'],
            'birthday' => $row['cliente_nascimento'],
            'cpf_cnpj' => $row['cliente_cpf_cnpj'],
            'rg' => $row['cliente_rg'],
            'rg_org' => $row['cliente_rg_orgao'],
            'rg_uf' => $row['cliente_uf'],
            'rg_date' => $row['cliente_rg_emissao'],
            'ie' => null,
            'gender' => lcfirst($row['cliente_genero']),
            'email' => $row['cliente_email'],
            'nationality' => $row['cliente_nacionalidade'],
            'naturalness' => $row['cliente_naturalidade'],
            'naturalness_uf' => $row['cliente_naturalidade_uf'],
            'marital_status' => ucfirst($row['cliente_estado_civil']),
            'mother' => $row['cliente_mae'],
            'father' => $row['cliente_pai'],
            'spouse' => $row['conjuge_nome'],
            'spouse_birthday' => $row['conjuge_nascimento'],
            'spouse_cpf' => $row['conjuge_cpf'],
            'spouse_rg' => $row['conjuge_rg'],
            'spouse_rg_org' => $row['conjuge_rg_orgao'],
            'spouse_rg_uf' => $row['conjuge_rg_uf'],
            'spouse_rg_date' => $row['conjuge_rg_emissao'],
            'spouse_gender' => lcfirst($row['conjuge_genero']),
            'spouse_nationality' => $row['conjuge_nacionalidade'],
            'spouse_naturalness' => $row['conjuge_naturalidade'],
            'spouse_naturalness_uf' => $row['conjuge_naturalidade_uf'],
            'spouse_email' => $row['conjuge_email'],
            'spouse_mother' => $row['conjuge_mae'],
            'spouse_father' => $row['conjuge_pai'],
        ];

        if (count(array_intersect_key(array_flip([
            "cliente_cep",
            "cliente_endereco",
            "cliente_numero",
            "cliente_complemento",
            "cliente_bairro",
            "cliente_cidade",
            "cliente_uf"
        ]), $row->toArray())) === 7) {
            $address = [
                'zipcode' => Arr::get($row, 'cliente_numero'),
                'address' => Arr::get($row, 'cliente_endereco'),
                'city' => Arr::get($row, 'cliente_cidade'),
                'uf' => Arr::get($row, 'cliente_uf'),
                'neighborhood' => Arr::get($row, 'cliente_bairro'),
                'number' => Arr::get($row, 'cliente_numero'),
                'complement' => Arr::get($row, 'cliente_complemento')
            ];
            $errorsAddress = $this->validateAddress($address, $rowIndex)->getMessageBag()->toArray();
            if (!empty($errorsAddress)) {
                $address = [];
            }
        }

        $number = 1;

        while (array_key_exists("cliente_celular_$number", $row->toArray())) {
            if (!is_null(Arr::get($row, "cliente_celular_$number"))) {
                array_push($contacts, ['type' => 'Celular', 'contact' => $row["cliente_celular_$number"]]);
            }
            ++$number;
        }

        $number = 1;

        while (array_key_exists("cliente_telefone_$number", $row->toArray())) {
            if (!is_null(Arr::get($row, "cliente_telefone_$number"))) {
                array_push($contacts, ['type' => 'Fixo', 'contact' => $row["cliente_telefone_$number"]]);
            }
            ++$number;
        }

        $number = 1;
        $errorsIncome = [];

        while (count(array_intersect_key(array_flip([
            "cliente_renda_ocupacao_$number",
            "cliente_renda_empresa_$number",
            "cliente_renda_cnpj_$number",
            "cliente_renda_cargo_$number",
            "cliente_renda_$number",
            "cliente_renda_inicio_$number"
        ]), $row->toArray())) === 6) {
            $income = [
                "occupation" => Arr::get($row, "cliente_renda_ocupacao_$number"),
                "company" => Arr::get($row, "cliente_renda_empresa_$number"),
                "cnpj" => Arr::get($row, "cliente_renda_cnpj_$number"),
                "role" => Arr::get($row, "cliente_renda_cargo_$number"),
                "value" => Arr::get($row, "cliente_renda_$number"),
                "start_date" => $row["cliente_renda_inicio_$number"],
                "spouse" => false
            ];
            $errorsIncome = $this->validateIncome($income, $rowIndex, $number)->getMessageBag()->toArray();
            if (empty($errorsIncome)) {
                array_push($incomes, $income);
                ++$number;
                continue;
            }
            $errorsIncomeAll = array_merge($errorsIncomeAll, $errorsIncome);
            ++$number;
        }

        $number = 1;

        while (count(array_intersect_key(array_flip([
            "conjuge_renda_ocupacao_$number",
            "conjuge_renda_empresa_$number",
            "conjuge_renda_cnpj_$number",
            "conjuge_renda_cargo_$number",
            "conjuge_renda_$number",
            "conjuge_renda_inicio_$number"
        ]), $row->toArray())) === 6) {

            $income = [
                "occupation" => Arr::get($row, "conjuge_renda_ocupacao_$number"),
                "company" => Arr::get($row, "conjuge_renda_empresa_$number"),
                "cnpj" => Arr::get($row, "conjuge_renda_cnpj_$number"),
                "role" => Arr::get($row, "conjuge_renda_cargo_$number"),
                "value" => Arr::get($row, "conjuge_renda_$number"),
                "start_date" => $row["conjuge_renda_inicio_$number"],
                "spouse" => true
            ];

            $errorsIncome = array_merge($errorsIncome, $this->validateIncome($income, $rowIndex, $number)->getMessageBag()->toArray());
            if (empty($errorsIncome)) {
                array_push($incomes, $income);
                ++$number;
                continue;
            }
            $errorsIncomeAll = array_merge($errorsIncomeAll, $errorsIncome);
            ++$number;
        }

        $number = 1;
        while (count(array_intersect_key(array_flip([
            "cliente_banco_$number",
            "cliente_agencia_$number",
            "cliente_conta_$number",
            "cliente_banco_abertura_$number",
            "cliente_tipo_conta_banco_$number"
        ]), $row->toArray())) === 5) {
            $bank = [
                "bank_code" => Arr::get($row, "cliente_banco_$number"),
                "agency" => Arr::get($row, "cliente_agencia_$number"),
                "account" => Arr::get($row, "cliente_conta_$number"),
                "account_type" => Arr::get($row, "cliente_tipo_conta_banco_$number"),
                "opening_date" => Arr::get($row, "cliente_banco_abertura_$number")
            ];
            $errorsBank = $this->validateBank($bank, $rowIndex, $number)->getMessageBag()->toArray();
            if (empty($errorsBank)) {
                array_push($banks, $bank);
                ++$number;
                continue;
            }
            $errorsBankAll = array_merge($errorsBankAll, $errorsBank);
            ++$number;
        }

        $data = $this->prepareForValidation($data);


        $validations = [
            'name' => ['required', 'string'],
            'birthday' => ['nullable', 'dateFormat:d/m/Y'],
            'cpf_cnpj' => ['required', 'cpf_cnpj'],
            'rg' => ['required'],
            'rg_org' => ['nullable', 'string'],
            'rg_uf' => ['nullable', 'string'],
            'rg_date' => ['nullable', 'dateFormat:d/m/Y'],
            'gender' => ['nullable', 'string', Rule::in(Customer::MALE, Customer::FEMALE)],
            'email' => ['nullable', 'email'],
            'marital_status' => ['nullable', 'string',  Rule::in(
                Customer::MARRIED,
                Customer::NOTMARRIED,
                Customer::DIVORCED,
                Customer::WIDOWER,
                Customer::SEPARETED
            ),],
            'spouse' => ['nullable', 'string'],
            'spouse_birthday' => ['nullable', 'dateFormat:d/m/Y'],
            'spouse_cpf' => ['nullable', 'cpf'],
            'spouse_rg_org' => ['nullable', 'string'],
            'spouse_rg_uf' => ['nullable', 'string'],
            'spouse_rg_date' => ['nullable', 'dateFormat:d/m/Y'],
            'spouse_gender' => ['nullable', 'string', Rule::in(Customer::MALE, Customer::FEMALE)],
            'spouse_email' => ['nullable', 'email'],
        ];

        $messages = [
            'name.required' => "cliente_nome é obrigatorio",
            'name.string' => "cliente_nome deve ser um nome válido",
            'cpf_cnpj.required' => "cliente_cpf_cnpj é obrigatorio",
            'cpf_cnpj.cpf_cnpj' => "cliente_cpf_cnpj deve ser um cpf ou cnpj válido",
            'rg.required' => "cliente_rg é obrigátorio",
            'birthday.date_format' => "cliente_nascimento deve ser uma data válida",
            'rg_org.string' => "cliente_rg_orgao deve ser um orgao válido",
            'rg_uf.string' => "cliente_rg_uf deve ser um uf válido",
            'rg_date.date_format' =>  "cliente_rg_emissao deve ser uma data válida",
            'gender.string' => "cliente_genero deve conter masculino ou feminino",
            'gender.in' => "cliente_genero deve conter masculino ou feminino",
            'email.email' => "cliente_email deve ser um email válido",
            'marital_status.string' => "cliente_estado_civil deve conter um dos seguintes status: Casado, Solteiro, Divorciado, Viúvo, Separado",
            'marital_status.in' => "cliente_estado_civil deve conter um dos seguintes status: Casado, Solteiro, Divorciado, Viúvo, Separado",
            'spouse.string' => "conjuge_nome deve ser um nome válido",
            'spouse_birthday.date_format' => "conjuge_nascimento deve ser uma data válida",
            'spouse_cpf.cpf' => "conjuge_cpf deve ser um cpf válido",
            'spouse_rg_org.string' => "conjuge_rg_orgao deve ser um orgao válido",
            'spouse_rg_uf.string' => "conjuge_rg_uf deve ser um uf válido",
            'spouse_rg_date.date_format' => "conjuge_rg_emissao deve ser uma data válida",
            'spouse_gender.string' => "conjuge_genero deve conter masculino ou feminino",
            'spouse_gender.in' => "conjuge_genero deve conter masculino ou feminino",
            'spouse_email.email' => "conjuge_email deve ser um email válido"
        ];

        $validator = Validator::make(
            $data,
            $validations,
            $messages
        );
        $errors = $validator->getMessageBag()->toArray();
        $errors = array_merge($errors, $errorsBankAll, $errorsIncomeAll, $errorsAddress);
        $rowFail = $rowIndex;
        foreach ($errors as $key => $value) {
            if ($key == "name" || $key == "cpf_cnpj" || $key == "rg") {
                array_push($rowDataCurrent['failed_rows'], $value[0]);
                if ($rowFail == $rowIndex) {
                    ++$this->finalizeMessages['total_failed_rows'];
                    $rowDataCurrent['status'] = "Não Inserido";
                    ++$rowDataCurrent['failed_rows_total'];
                    $rowFail = 0;
                }
                continue;
            }
            array_push($rowDataCurrent['field_not_Entered'], $value[0]);
            if ($rowFail == $rowIndex) {
                ++$this->finalizeMessages['total_success_rows_incomplete'];
                $rowDataCurrent['status'] = "Incompleto";
                $rowFail = 0;
            }
        }

        if (empty($errors)) {
            ++$this->finalizeMessages['total_success_rows_complete'];
            $rowDataCurrent['status'] = "Completo";
        }
        $rowDataCurrent['field_not_Entered_total'] = count($rowDataCurrent['field_not_Entered']);
        $this->finalizeMessages['rows']["Linha $rowIndex"] = $rowDataCurrent;

        if (count(array_intersect_key(array_flip([
            "name",
            "cpf_cnpj",
            "rg"
        ]), $errors)) === 0) {
            foreach (array_keys($errors) as $key) {
                $data[$key] = null;
            }
            $customer = Customer::create($data);
            if (!empty($contacts)) {
                ContactService::upsert($customer->contacts(), $contacts);
            }

            if (!empty($incomes)) {
                IncomeService::upsert($customer, $incomes);
            }

            if (!empty($banks)) {
                BankingReferencesService::upsert($customer, $banks);
            }

            if (!empty($address)) {
                $customer->address()->create($address);
            }
        }
    }
}
