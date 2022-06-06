<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted'             => ':Attribute deve ser aceito.',
    'active_url'           => ':Attribute não é uma URL válida.',
    'after'                => ':Attribute deve ser uma data depois de :date.',
    'alpha'                => ':Attribute deve conter somente letras.',
    'alpha_dash'           => ':Attribute deve conter letras, números e traços.',
    'alpha_num'            => ':Attribute deve conter somente letras e números.',
    'array'                => ':Attribute deve ser um array.',
    'before'               => ':Attribute deve ser uma data antes de :date.',
    'between'              => [
        'numeric' => ':Attribute deve estar entre :min e :max.',
        'file'    => ':Attribute deve estar entre :min e :max kilobytes.',
        'string'  => ':Attribute deve estar entre :min e :max caracteres.',
        'array'   => ':Attribute deve ter entre :min e :max itens.',
    ],
    'boolean'              => ':Attribute deve ser verdadeiro ou falso.',
    'confirmed'            => 'A confirmação de :attribute não confere.',
    'date'                 => ':Attribute não é uma data válida.',
    'date_format'          => ':Attribute não confere com o formato dia/mês/ano.',
    'different'            => ':Attribute e :other devem ser diferentes.',
    'digits'               => ':Attribute deve ter :digits dígitos.',
    'digits_between'       => ':Attribute deve ter entre :min e :max dígitos.',
    'email'                => ':Attribute deve ser um endereço de e-mail válido.',
    'exists'               => 'O :attribute selecionado não existe.',
    'filled'               => ':Attribute é um campo obrigatório.',
    'image'                => ':Attribute deve ser uma imagem.',
    'in'                   => ':Attribute é inválido.',
    'integer'              => ':Attribute deve ser um inteiro.',
    'ip'                   => ':Attribute deve ser um endereço IP válido.',
    'json'                 => ':Attribute deve ser um JSON válido.',
    'max'                  => [
        'numeric' => ':Attribute não deve ser maior que :max.',
        'file'    => ':Attribute não deve ter mais que :max kilobytes.',
        'string'  => ':Attribute não deve ter mais que :max caracteres.',
        'array'   => ':Attribute não deve ter mais que :max itens.',
    ],
    'mimes'                => ':Attribute deve ser um arquivo do tipo: :values.',
    'min'                  => [
        'numeric' => ':Attribute deve ser no mínimo :min.',
        'file'    => ':Attribute deve ter no mínimo :min kilobytes.',
        'string'  => ':Attribute deve ter no mínimo :min caracteres.',
        'array'   => ':Attribute deve ter no mínimo :min itens.',
    ],
    'not_in'               => 'O :attribute selecionado é inválido.',
    'numeric'              => ':Attribute deve ser um número.',
    'regex'                => 'O formato de :attribute é inválido.',
    'required'             => 'O campo :attribute é obrigatório.',
    'required_if'          => 'O campo :attribute é obrigatório quando :other é :value.',
    'required_unless'      => 'O :attribute é necessário a menos que :other esteja em :values.',
    'required_with'        => 'O campo :attribute é obrigatório quando :values está presente.',
    'required_with_all'    => 'O campo :attribute é obrigatório quando :values estão presentes.',
    'required_without'     => 'O campo :attribute é obrigatório quando :values não está presente.',
    'required_without_all' => 'O campo :attribute é obrigatório quando nenhum destes estão presentes: :values.',
    'same'                 => ':Attribute e :other devem ser iguais.',
    'size'                 => [
        'numeric' => ':Attribute deve ser :size.',
        'file'    => ':Attribute deve ter :size kilobytes.',
        'string'  => ':Attribute deve ter :size caracteres.',
        'array'   => ':Attribute deve conter :size itens.',
    ],
    'string'               => ':Attribute deve ser uma string',
    'timezone'             => ':Attribute deve ser uma timezone válida.',
    'unique'               => ':Attribute já está em uso.',
    'url'                  => 'O formato de :attribute é inválido.',


    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap attribute place-holders
    | with something more reader friendly such as E-Mail Address instead
    | of "email". This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [
        'password'                               => 'senha',
        'password_confirmation'                  => 'confirmação de senha',
        'name'                                   => 'nome',
        'cpf_cnpj'                               => 'CPF/CNPJ',
        'title'                                  => 'título',
        'start_date'                             => 'data de inicio',
        'end_date'                               => 'data de termino',
        'acronym'                                => 'acrônimo',
        'description'                            => 'descrição',

        'company_name'                           => 'razão social',
        'resp_name'                              => 'nome do responsável',
        'resp_email'                             => 'email do responsável',
        'telephone'                              => 'telefone',
        'cell_phone'                             => 'celular',
        'expire_date'                            => 'vencimento',
        'active'                                => 'ativo',

        'birthday'                               => 'data de nascimento',
        'gender'                                 => 'genêro',
        'confirmedt_at'                          => 'data de confirmação',

        // Routes
        'route_group'                            => 'grupo da rota',
        'route_name'                             => 'nome da rota',
        'route_path'                             => 'nome da empresa',

        // Endereço
        'zipcode'                                => 'CEP',
        'address'                                => 'endereço',
        'number'                                 => 'número',
        'neighborhood'                           => 'bairro',
        'city'                                   => 'cidade',
        'uf'                                     => 'estado',
        'complement'                             => 'complemento',
        'addressable_type'                       => 'tipo de endereço',
        'addressable_id'                         => 'id do tipo do endereço',
        'addresses'                              => 'endereços',
        'addresses.*.zipcode'                    => 'CEP',
        'addresses.*.address'                    => 'endereço',
        'addresses.*.number'                     => 'número',
        'addresses.*.neighborhood'               => 'bairro',
        'addresses.*.city'                       => 'cidade',
        'addresses.*.uf'                         => 'estado',
        '*.cpf_cnpj'                             => 'CPF/CNPJ',

        'initial_interval'                       => 'iníncio',
        'finish_interval'                        => 'final',
        'bank_id'                                => 'banco',
        'product_id'                             => 'produto',
        'operation_id'                           => 'operação',
        'promoter_id'                            => 'promotora',
        'finished_at'                            => 'data de término',
        'started_at'                             => 'data de início',

        'comissions'                             => 'configurações de repasses',
        'comissions.*.description'               => 'descrição de repasse',
        'comissions.*.amount'                    => 'montante de repasse',
        'comissions.*.percent'                   => 'porcentagem de repasse',

        'receipt_settings'                       => 'configurações de recebimentos',
        'receipt_settings.*.description'         => 'descrição de recebimentos',
        'receipt_settings.*.amount'              => 'montante do recebimento',
        'receipt_settings.*.percent'             => 'percentagem do recebimento',
        'receipt_settings.*.comission_value'     => 'valor comissionável',

        'receipt_settings.*.comissions'                       => 'comissões',
        'receipt_settings.*.comissions.*.description'         => 'descrição de comissões',
        'receipt_settings.*.comissions.*.amount'              => 'montante do comissões',
        'receipt_settings.*.comissions.*.percent'             => 'percentagem do comissões',


        'ie'                                => 'inscrição estadual',
        'nationality'                                => 'nacionalidade',
        'naturalness'                                => 'naturalidade',
        'rg_date'                                => 'data do RG',
        'rg_org'                                 => 'orgão de expedissão do RG',
        'rg_uf'                                  => 'estado do RG',
        'has_card'                               => 'possí cartão',
        'mother_name'                            => 'nome da mãe',
        'father_name'                            => 'nome do pai',
        'relation_name'                          => 'nome do(a) companheiro(a)',
        'salary'                                 => 'salário',
        'role'                                   => 'cargo',
        'occupation'                             => 'oucupação',
        'company'                                => 'empresa',
        'service_time'                           => 'tempo de serviço',
        'note'                                   => 'observação',
        'notes'                                  => 'observações',

        'references'                             => 'referências',
        'references.*.name'                      => 'nome de referência',
        'references.*.number'                    => 'número de referência',

        'contacts'                               => 'contatos',
        'contact.*.number'                       => 'número para contato',
        'contact.*.type'                         => 'tipo de contato',

        'bank_accounts'                          => 'dados bancário',
        'bank_accounts.*.agency'                 => 'agência',
        'bank_accounts.*.account_number'         => 'número da conta',
        'bank_accounts.*.type'                   => 'tipo de conta',
        'bank_accounts.*.bank_id'                => 'banco',

        'benefits'                               => 'benefícios',
        'benefits.*.number'                      => 'número do benefício',
        'benefits.*.breed'                       => 'espécie do benefício',
        'benefits.*.uf'                          => 'estado do benefício',
        'benefits.*.salary'                      => 'salário do benefício',
        'benefits.*.reference'                   => 'base do benefício',
        'benefits.*.bank_account'                => 'dados bancários',
        'benefits.*.bank_account.agency'         => 'agência',
        'benefits.*.bank_account.account_number' => 'número da conta',
        'benefits.*.bank_account.type'           => 'tipo de conta',
        'benefits.*.bank_account.bank_id'        => 'banco',

    ],

];
