<!DOCTYPE html>
<html lang="zxx" dir="ltr">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>{{ __('Teklif Formu') }}</title>
    <link href="{{ asset('assets/media/logos/filologo.png') }}" rel="icon">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/invoice/css/custom.css') }}">
    <meta name="viewport" content="width=1000">

    <style>
        /* Alt bilgi için sabit pozisyon CSS'i */
        .agency-bottom-content {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            z-index: 100;
            padding: 15px 0;
            border-top: 1px solid #eee;
        }

        .container.bottom-button {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
        }

        .invo-buttons-wrap {
            display: flex;
            justify-content: flex-end;
            gap: 15px;
        }

        .invo-btns a {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: #007bff;
            border-radius: 5px;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .invo-btns a:hover {
            background: #0056b3;
        }

        /* Yazdırma sırasında gizleme */
        @media print {
            .d-print-none {
                display: none !important;
            }
        }

        /* İçerik alanı için alt boşluk */
        .main-content {
            padding-bottom: 80px;
            /* Alt bilgi yüksekliğine göre ayarlayın */
        }
    </style>
</head>

<body>
    <!--Invoice Wrap Start here -->
    <div class="invoice_wrap">
        <div class="invoice-container">
            <div class="main-content">
                <div class="invoice-content-wrap" id="download_section">
                    <!--Header Start Here -->
                    <header class="invoice-header back-img-invoice" id="invo_header">
                        <div class="invoice-logo-content py-3">
                            <div class="invoice-logo">
                                <a href="{{ url('/') }}" class="logo"><img
                                        src="{{ asset('assets/media/logos/logo-red.png') }}" alt=""
                                        style="height: 100px;"></a>
                            </div>

                        </div>
                    </header>
                    <!--Header End Here -->
                    <!--Invoice content start here -->
                    <section class="agency-service-content restaurant-invoice-content" id="restaurant_bill">
                        <div class="container">
                            <!--invoice owner name content -->
                            <div class="invoice-owner-conte-wrap">
                                <div class="invo-to-wrap">
                                    <div class="invoice-to-content">
                                        <div class="invo-to-owner inter-700 md-lg-font">
                                            {{ $data->customer->company_name }}</div>
                                        <div class="invo-head-wrap invoi-date-wrap-left">
                                            <div class="invo-num-title-left invo-date inter-700">Yetkili:</div>
                                            <div class="invo-num-left inter-400" style="text-transform: uppercase;">
                                                {{ $data->customer->first_name . ' ' . $data->customer->last_name }}
                                            </div>
                                        </div>
                                        <div class="invo-head-wrap invoi-date-wrap-left">
                                            <div class="invo-num-title-left invo-date inter-700">Telefon:</div>
                                            <div class="invo-num-left inter-400">
                                                {{ $data->customer->phone_number ?? $data->customer->mobile_number }}
                                            </div>
                                        </div>
                                        <div class="invo-head-wrap invoi-date-wrap-left">
                                            <div class="invo-num-title-left invo-date inter-700">E-Posta:</div>
                                            <div class="invo-num-left inter-400">{{ $data->customer->email }}</div>
                                        </div>

                                    </div>
                                </div>
                                <div class="invo-pay-to-wrap">
                                    <div class="invoice-pay-content">
                                        <div class="invo-head-wrap">
                                            <div class="invo-num-title invo-no inter-700">Teklif No:</div>
                                            <div class="invo-num inter-400">#{{ $data->service->parts_to_replace }}
                                            </div>
                                        </div>
                                        <div class="invo-head-wrap invoi-date-wrap">
                                            <div class="invo-num-title invo-date inter-700">Teklif Tarihi:</div>
                                            <div class="invo-num inter-400">{{ $data->created_at }}</div>
                                        </div>
                                        <div class="invo-head-wrap invoi-date-wrap">
                                            <div class="invo-num-title invo-date inter-700">Yetkili:</div>
                                            <div class="invo-num inter-400" style="text-transform: uppercase;">
                                                {{ \App\Models\User::Find($data->service->assigned_by)->name . ' ' . \App\Models\User::Find($data->service->assigned_by)->last_name }}
                                            </div>
                                        </div>
                                        <div class="invo-head-wrap invoi-date-wrap">
                                            <div class="invo-num-title invo-date inter-700">Telefon:</div>
                                            <div class="invo-num inter-400">
                                                {{ \App\Models\User::Find($data->service->assigned_by)->phone_number }}
                                            </div>
                                        </div>
                                        <div class="invo-head-wrap invoi-date-wrap">
                                            <div class="invo-num-title invo-date inter-700">E-Posta:</div>
                                            <div class="invo-num inter-400">
                                                {{ \App\Models\User::Find($data->service->assigned_by)->email }}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <!--invoice owner name end here -->
                            <div class="payment-table-wrap hospital-table-wrap">
                                <table class="invo-payment-table" style="margin-top: -10px;">
                                    <thead>
                                        <tr class="invo-tb-header">
                                            <th class="invo-table-title inter-700 payemnt-wid medium-font b-text">Makina
                                                Marka</th>
                                            <th class="invo-table-title inter-700 date-wid medium-font b-text">Seri No
                                            </th>
                                            <th class="invo-table-title inter-700 trans-wid medium-font b-text">Konu
                                            </th>
                                            <th
                                                class="invo-table-title inter-700 amount-wid medium-font b-text total-head">
                                                Teklif Geçerlilik Tarihi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="invo-paye-row" style="margin-top: -10px;">
                                            <td class="invo-total-data inter-400 payment-desc second-color">
                                                {{ $data->car->brand . ' / ' . $data->car->model }}</td>
                                            <td class="invo-total-data inter-400 payment-desc second-color">
                                                {{ $data->car->number_plate }}</td>
                                            <td class="invo-total-data inter-400 payment-desc second-color">
                                                {{ $data->service->things_to_do }}</td>
                                            <td class="invo-total-data inter-400 payment-desc second-color">
                                                {{ $data->due }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                @if ($data->service->note)
                                    <div style="margin-top: -30px;padding-bottom: 5px;">
                                        <h4 class="inter-700 b-text" style="padding-top: 10px;">Not:</h4>
                                        <p class="inter-400 second-color" style="margin-top: -25px;font-size: 14px;">
                                            {{ $data->service->note ?? '' }}</p>
                                    </div>
                                @endif
                            </div>
                            <!--Invoice Table Data Start here -->
                            <div class="table-wrapper">
                                <table class="invoice-table">
                                    <thead>
                                        <tr class="invo-tb-header">
                                            <th class="invo-table-title re-desc-wid inter-700 medium-font"
                                                style="width: 5%;">Sıra</th>
                                            <th class="invo-table-title re-desc-wid inter-700 medium-font"
                                                style="width: 45%;">Açıklama</th>
                                            <th class="invo-table-title sno-wid inter-700 medium-font t-right"
                                                style="width: 10%;">Adet</th>
                                            <th class="invo-table-title re-price-wid inter-700 medium-font t-right"
                                                style="width: 15%;">Birim Fiyat</th>
                                            <th class="invo-table-title re-qty-wid rate-title inter-700 medium-font t-right"
                                                style="width: 25%;">Toplam</th>
                                        </tr>
                                    </thead>
                                    <tbody class="invo-tb-body">
                                        @php
                                            $subTotal = 0;
                                        @endphp
                                        @foreach ($data->parts as $part)
                                            <style>
                                                .invoice-table td {
                                                    color: #000;
                                                    font-size: 12px;
                                                    line-height: 12px;
                                                    padding: {{ $loop->iteration > 6 ? ($loop->iteration > 12 ? 3 : 10) : 15 }}px 0;
                                                }
                                            </style>
                                            @php
                                                $subTotal += $part->per_price * $part->qty * ($part->cur_index ?? 1);
                                            @endphp
                                            <tr class="invo-tb-row">
                                                <td class="invo-tb-data" style="width: 5%;">{{ $loop->iteration }}
                                                </td>
                                                <td class="invo-tb-data" style="width: 50%;">{{ $part->name }}</td>
                                                <td class="invo-tb-data t-right" style="width: 10%;">
                                                    {{ $part->qty }}</td>
                                                <td class="invo-tb-data t-right" style="width: 15%;">
                                                    {{ number_format($part->per_price, 2, ',', '.') }}
                                                    {{ \App\Helper\GeneralHelper::getCurrencySymbol($part->currency) }}
                                                    @if ($part->currency != 'TRY')
                                                        <br>({{ number_format($part->cur_index * $part->per_price, 2, ',', '.') }})
                                                        ₺
                                                    @endif
                                                </td>
                                                <td class="invo-tb-data rate-data t-right" style="width: 25%;">
                                                    {{ number_format($part->per_price * $part->qty, 2, ',', '.') }}
                                                    {{ \App\Helper\GeneralHelper::getCurrencySymbol($part->currency) }}
                                                    @if ($part->currency != 'TRY')
                                                        <br>
                                                        ({{ number_format($part->cur_index * $part->per_price * $part->qty, 2, ',', '.') }})
                                                        ₺
                                                    @endif
                                                </td>
                                            </tr>
                                        @endforeach

                                        @php
                                            $grossTotal =
                                                $subTotal + $data->service->labor_amount - $data->service->discount;
                                        @endphp
                                    </tbody>
                                </table>
                            </div>
                            <!--Invoice Table Data End here -->

                            <!--Invoice additional info start here -->
                            <div class="invo-addition-wrap">
                                <div class="invo-add-info-content">
                                    <h3 class="addi-info-title inter-700 medium-font"> Koşullar:</h3>
                                    <p class="add-info-desc inter-400 mtb-0">
                                        1. Müşteri, bu teklifin kabul edildiğini yazılı bir şekilde belirttikten sonra
                                        işlemler başlatılacaktır.<br>
                                        2. Ödeme, hizmet ve malların tesliminden sonra havale ile yapılacaktır. <br>
                                        3. Birim fiyatlarımızda %20 KDV hariçtir.<br>
                                        4. Fiyatlarımız fatura tarihinde TCMB Efektif satış kuru alınarak TL'ye
                                        çevirilip fatura kesilecektir.
                                    </p>
                                </div>
                                <div class="invo-bill-total">
                                    <table class="invo-total-table">
                                        <tbody>
                                            <tr>
                                                <td class="inter-700 medium-font b-text hotel-sub">Toplam:</td>
                                                <td class="invo-total-data inter-400 medium-font second-color">
                                                    {{ number_format($subTotal, 2, ',', '.') }} ₺</td>
                                            </tr>
                                            <tr>
                                                <td class="inter-700 medium-font b-text hotel-sub">İşçilik:</td>
                                                <td class="invo-total-data inter-400 medium-font second-color">
                                                    {{ number_format($data->service->labor_amount, 2, ',', '.') }} ₺
                                                </td>
                                            </tr>
                                            @if ($data->service->discount)
                                                <tr class="disc-row bottom-border">
                                                    <td class="inter-700 medium-font b-text hotel-sub">İSKONTO:</td>
                                                    <td class="invo-total-data inter-400 medium-font discount-price">-
                                                        {{ number_format($data->service->discount, 2, ',', '.') }} ₺
                                                    </td>
                                                </tr>
                                            @endif
                                            <tr class="disc-row bottom-border">
                                                <td class="inter-700 medium-font b-text hotel-sub"
                                                    style="font-size: 14.5px;">Ara Toplam:</td>
                                                <td class="invo-total-data inter-400 medium-font second-color"
                                                    style="font-size: 14px;">
                                                    {{ number_format($grossTotal, 2, ',', '.') }} ₺</td>
                                            </tr>
                                            <tr class="tax-row">
                                                <td class="inter-700 medium-font b-text hotel-sub">KDV <span
                                                        class="invo-total-data inter-700 medium-font second-color">(20%)</span>
                                                </td>
                                                <td class="invo-total-data inter-400 medium-font second-color">
                                                    {{ number_format($grossTotal * 0.2, 2, ',', '.') }} ₺</td>
                                            </tr>
                                            <tr class="invo-grand-total">
                                                <td class="inter-700 sm-text primary-color hotel-sub"
                                                    style="color: red;">Genel Toplam:</td>
                                                <td class="sm-text b-text invo-total-price">
                                                    {{ number_format($grossTotal * 1.2, 2, ',', '.') }} ₺</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <!--Invoice additional info end here -->

                            <!--Payment detail table start here -->
                            <div style="margin-bottom: 75px;">
                                <h3 class="mtb-0 res-manager inter-400 medium-font b-text t-right">Kaşe-İmza</h3>
                                <div class="rest-payment-bill right t-right">
                                    <div class="payment-wrap t-right" style="width: 250px;height: 100px;">
                                        <div>
                                            <span class="signature-wrap">
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <!--Payment detail table end here -->
                            </div>

                    </section>
                    <div class="agency-bottom-content bottom-info">
                        <div class="">
                            <!--print-download content start here -->
                            <div class="link-bottom">
                                <a href="https://www.fshmakina.com.tr/">www.fshmakina.com.tr </a>
                                <span>&nbsp;|&nbsp;</span>
                                <a href="mailto: info@fshmakina.com">info@fshmakina.com </a>
                            </div>
                            <div class="invo-buttons-wrap bottom-address">
                                <div class="address">
                                    <h6>İSTANBUL BÖLGE SERVİS</h6>
                                    <p>0534 711 37 37 - 0212 999 77 51</p>
                                    <div>Selahaddin Eyyübi Mah. 1613 Sk.<br>Evren 2 Oto San Sit 25A Blok
                                        No:1<br>Esenyurt/İSTANBUL</div>
                                </div>
                                <div class="address">
                                    <h6>SHOWROOM</h6>
                                    <p>0532 471 37 87 - 0282 502 97 87</p>
                                    <div>Veliköy Mah. İnönü Cad. A1 Blok<br>7/13 Çerkezkent<br>Çerkezköy/TEKİRDAĞ</div>
                                </div>
                                <div class="address">
                                    <h6>TRAKYA BÖLGE SERVİS</h6>
                                    <p>0532 374 27 37 - 0282 502 97 87</p>
                                    <div>Veliköy Mah. Dere Cad. C21 Blok<br>4/2D Çerkezkent<br>Çerkezköy/TEKİRDAĞ</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--Invoice content end here -->
                </div>
            </div>


            <!--bottom content start here -->
            <section class="agency-bottom-content">

                <div class="container bottom-button  d-print-none" id="agency_bottom">
                    <!--print-download content start here -->
                    <div class="invo-buttons-wrap">
                        @if (!(isset($data->guest) && $data->guest))
                            @if (!(isset($data->noOrder) && $data->noOrder))
                                <div class="invo-print-btn invo-btns">
                                    <a href="{{ route('Offer.Order', ['id' => $data->service->id]) }}"
                                        class="print-btn">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_5_313)">
                                                <path
                                                    d="M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19"
                                                    stroke="white" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                                <path
                                                    d="M17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21Z"
                                                    stroke="white" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                                <path d="M9 7H10" stroke="white" stroke-width="2"
                                                    stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M9 13H15" stroke="white" stroke-width="2"
                                                    stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M13 17H15" stroke="white" stroke-width="2"
                                                    stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_5_313">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <span class="inter-700 medium-font" style="color: #fff">Emre Çevir</span>
                                    </a>
                                </div>
                            @endif
                        @endif
                        <div class="invo-down-btn invo-btns">
                            <a class="download-btn" id="generatePDF"
                                data-pdf-name="{{ \Illuminate\Support\Str::slug($data->service->parts_to_replace . '-' . $data->customer->company_name) }}">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_5_246)">
                                        <path
                                            d="M4 17V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V17"
                                            stroke="white" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path d="M7 11L12 16L17 11" stroke="white" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 4V16" stroke="white" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_5_246">
                                            <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span class="inter-700 medium-font" style="color: #fff">PDF</span>
                            </a>
                        </div>
                    </div>
                    <!--print-download content end here -->
                </div>
            </section>
        </div>
    </div>
    <!--Invoice Wrap End here -->
    <script src="{{ asset('assets/invoice/js/jquery.min.js') }}"></script>
    <script src="{{ asset('assets/invoice/js/jspdf.min.js') }}"></script>
    <script src="{{ asset('assets/invoice/js/html2canvas.min.js') }}"></script>
    <script src="{{ asset('assets/invoice/js/custom.js') }}"></script>
</body>

</html>
