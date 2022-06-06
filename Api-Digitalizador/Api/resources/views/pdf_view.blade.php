<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />

		<title>A simple, clean, and responsive HTML invoice template</title>

		<!-- Invoice styling -->
		<style>
			body {
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				text-align: center;
				color: #777;
			}

			.teste{
				white-space: pre-wrap;
			}

			body h1 {
				font-weight: 300;
				margin-bottom: 0px;
				padding-bottom: 0px;
				color: #000;
			}

			body h3 {
				font-weight: 300;
				margin-top: 10px;
				margin-bottom: 20px;
				font-style: italic;
				color: #555;
			}

			body a {
				color: #06f;
			}

			.invoice-box {
				max-width: 800px;
				margin: auto;
				padding: 30px;
				border: 1px solid #eee;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
				font-size: 16px;
				line-height: 24px;
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #555;
			}

			.invoice-box table {
				width: 100%;
				line-height: inherit;
				text-align: left;
				border-collapse: collapse;
			}

			.invoice-box table td {
				padding: 5px;
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;
				line-height: 45px;
				color: #333;
			}

			.invoice-box table tr.information table td {
				padding-bottom: 40px;
			}

			.invoice-box table tr.heading td {
				background: rgba(148, 142, 142, 0.466);
				border-bottom: 1px solid #ddd;
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
			}

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}

				.invoice-box table tr.information table td {
					width: 100%;
					display: block;
					text-align: center;
				}
			}
		</style>
	</head>

	<body>
		<div class="invoice-box">
			<table>
				<tr class="top">
					<td colspan="2">
						<table>
							<tr>
								<td class="title">
                                    @if($logoPath)
									<img src="{{$logoPath}}" style="width: 100%; max-width: 300px; max-height: 200px;" />
                                    @endif
								</td>
								<td>
									Contrato de {{ $sale->type }}<br />
									Vendido em: {{ $sale->sold_at }}<br />
									Entregue em: {{ $sale->delivered_at }}<br />
									Preço: R${{ $sale->price }}<br />
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr class="heading">
					<td>Cliente</td>

					<td>#</td>
				</tr>

				<tr class="item">
					<td>Nome</td>
					<td>{{ $customer->name }}</td>
				</tr>

                <tr class="item">
                    <td>CPF/CNPJ</td>
					<td>{{ $customer->cpf_cnpj }}</td>
                </tr>

                <tr class="item">
                    <td>Endereço</td>
					@if($customer->address)
					<td>{{ $customer->address->address }} {{ $customer->address->number }} {{ $customer->address->neighborhood }} {{ $customer->address->city }}</td>
					@endif
                </tr>

                <tr class="item">
                    <td>Email</td>
					<td>{{ $customer->email }}</td>
                </tr>

                <tr class="item">
                    <td>Celular</td>
					<td>{{ $contact }}</td>
                </tr>

				<tr class="heading">
					<td>Veiculo</td>
					<td>#</td>
				</tr>

				<tr class="item">
					<td>Marca</td>
					<td>{{ $vehicle->manufacturer }}</td>
				</tr>

				<tr class="item">
					<td>Modelo</td>
					<td>{{ $vehicle->model }}</td>
				</tr>

				<tr class="item">
					<td>Ano e Modelo</td>
					<td>{{ $vehicle->year_and_model }}</td>
				</tr>

                <tr class="item">
					<td>Cor</td>
					<td>{{ $vehicle->color }}</td>
				</tr>

                <tr class="item">
					<td>Chassi</td>
					<td>{{ $vehicle->chassi }}</td>
				</tr>

                <tr class="item">
					<td>Motor</td>
					<td>{{ $vehicle->engine }}</td>
				</tr>

                <tr class="item">
					<td>Renavam</td>
					<td>{{ $vehicle->renavam }}</td>
				</tr>
                <tr class="item">
					<td>Placa</td>
					<td>{{ $vehicle->board }}</td>
				</tr>
                <tr class="item">
					<td>Combustivel</td>
					<td>{{ $vehicle->fuel }}</td>
				</tr>
                <tr class="item">
					<td>CRLV</td>
					<td>{{ $vehicle->crlv }}</td>
				</tr>
                <tr class="item">
					<td>KM</td>
					<td>{{ $vehicle->km }}</td>
				</tr>
                <tr class="item">
					<td>Nome</td>
					<td>{{ $vehicle->owner }}</td>
				</tr>
                <tr class="item">
					<td>CPF</td>
					<td>{{ $vehicle->owner_doc }}</td>
				</tr>
				<tr class="heading">
					<td>Documentacão</td>
					<td></td>
				</tr>
			</table>
			<p>{{ $sale->documentation }}<p>
			<table>
				<tr class="heading">
					<td>Termos de garantia</td>
					<td></td>
				</tr>
			</table>
			<p>{{ $sale->term }} <p>
			<table>
				<tr class="heading">
					<td>Observações</td>
					<td></td>
				</tr>
			</table>
			<p>{{ $sale->notes }} <p>
		</div>
	</body>
</html>
