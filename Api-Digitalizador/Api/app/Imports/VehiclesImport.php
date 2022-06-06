<?php

namespace App\Imports;

use App\Models\Vehicle;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\RemembersRowNumber;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Row;

class VehiclesImport implements WithHeadingRow, SkipsEmptyRows, OnEachRow
{
    use Importable, SkipsFailures, RemembersRowNumber;

    private array $finalizeMessages = [
        "rows" => [],
        "total_success_rows_complete" => 0,
        "total_failed_rows" => 0,
        "total_success_rows_incomplete" => 0,
        "rows_total" => 0,
        "rows_success_complete_percentage" => 0,
        "status" => "concluido"
    ];

    public function finalize(object $import):void
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

        $data = [
            'board' => Arr::get($row, 'placa'),
            'renavam' => Arr::get($row, 'renavam'),
            'type' => Arr::get($row, 'tipo'),
            'fuel' => Arr::get($row, 'combustivel'),
            'manufacturer' => Arr::get($row, 'marca'),
            'crlv' => Arr::get($row, 'crlv'),
            'model' => Arr::get($row, 'modelo'),
            'km' => Arr::get($row, 'km'),
            'year_and_model' => Arr::get($row, 'ano_modelo'),
            'owner' => Arr::get($row, 'proprietario'),
            'owner_doc' => Arr::get($row, 'proprietario_cpf_cnpj'),
            'color' => Arr::get($row, 'cor'),
            'chassi' => Arr::get($row, 'chassi'),
            'engine' => Arr::get($row, 'motor'),
        ];

        $validations = [
            'board' => ['required', 'placa'],
            'renavam' => ['required'],
            'type' => ['required', 'string'],
            'fuel' => ['required', 'string'],
            'manufacturer' => ['required', 'string'],
            'crlv' => ['required'],
            'model' => ['required', 'string'],
            'km' => ['required', 'numeric'],
            'year_and_model' => ['required', 'regex:([0-9]{4}[/][0-9]{4})'],
            'owner' => ['required', 'string'],
            'owner_doc' => ['required', 'cpf_cnpj'],
            'color' => ['required', 'string'],
            'chassi' => ['required', 'min:17', 'max:17',],
            'engine' => ['required'],
        ];

        $messages = [
            'board.required' => "o campo placa é obrigátorio",
            'board.placa' => "o campo placa deve ser uma placa válida",
            "renavam.required" => "o campo renavam é obrigátorio",
            "type.required" => "o campo tipo é obrigátorio",
            "type.string" => "o campo tipo deve ser um tipo válido",
            "fuel.required" => "o campo combustivel é obrigátorio",
            "fuel.string" => "o campo combustivel deve ser um combustivel válido",
            "manufacturer.required" => "o campo marca é obrigátorio",
            "manufacturer.string" => "o campo marca deve ser uma marca válida",
            "crlv.required" => "o campo crlv é obrigátorio",
            "model.required" => "o campo modelo é obrigátorio",
            "model.string" => "o campo modelo deve ser um modelo válido",
            "km.required" => "o campo km é obrigátorio",
            "km.numeric" => "o campo km deve ser um km valido",
            "year_and_model.required" => "o campo ano_modelo é obrigátorio",
            "year_and_model.regex" => "o campo ano_modelo deve estar no formato ano/ano",
            'owner.required' => "o campo proprietario é obrigátorio",
            'owner.string' => "o campo proprietario deve ser um nome válido",
            'owner_doc.required' => "o campo proprietario_cpf_cnpj é obrigatorio",
            'owner_doc.cpf_cnpj' => "o campo proprietario_cpf_cnpj deve ser um cpf ou cnpj válido",
            "color.required" => "o campo cor é obrigátorio",
            "color.string" => "o campo cor deve ser uma cor válida",
            "chassi.required" => "o campo chassi é obrigatório",
            "chassi.min" => "o campo chassi deve ter 17 caracteres",
            "chassi.max" => "o campo chassi deve ter 17 caracteres",
            "engine.required" => "o campo motor é obrigátorio",
         ];

         $validator = Validator::make(
            $data,
            $validations,
            $messages
        );

        $errors = $validator->getMessageBag()->toArray();
        $rowFail = $rowIndex;
        foreach($errors as $value){
            array_push($rowDataCurrent['failed_rows'], $value[0]);
            if ($rowFail == $rowIndex) {
                ++$this->finalizeMessages['total_failed_rows'];
                $rowDataCurrent['status'] = "Não Inserido";
                ++$rowDataCurrent['failed_rows_total'];
                $rowFail = 0;
            }
            continue;
        }
        if (empty($errors)) {
            ++$this->finalizeMessages['total_success_rows_complete'];
            $rowDataCurrent['status'] = "Completo";
        }
        $this->finalizeMessages['rows']["Linha $rowIndex"] = $rowDataCurrent;

        if(!empty($errors)){
            Vehicle::create($data);
        }
    }
}
