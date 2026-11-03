<html>
<head>
    <title>HASH RESULT</title>
    <meta http-equiv="Content-Language" content="tr">
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-9">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="now">
</head>

<body>
<table>
    <?php
    $postParams = array();
    foreach ($_POST as $key => $value) {
        array_push($postParams, $key);
        // XSS güvenliği için htmlspecialchars kullanıyoruz
        echo "<tr><td>" . htmlspecialchars($key) . "</td><td>" . htmlspecialchars($value) . "</td></tr>";
    }

    natcasesort($postParams);

    $hashval = "";
    foreach ($postParams as $param) {
        $paramValue = $_POST[$param];
        $escapedParamValue = str_replace("|", "\\|", str_replace("\\", "\\\\", $paramValue));

        $lowerParam = strtolower($param);
        if ($lowerParam != "hash" && $lowerParam != "encoding") {
            $hashval = $hashval . $escapedParamValue . "|";
        }
    }

    // storeKey güvenli bir şekilde çevresel değişkenlerden alınmalı
    $storeKey = "cnEQrujQR5YRJBs1!"; // Çevresel değişken kullanımı

    $escapedStoreKey = str_replace("|", "\\|", str_replace("\\", "\\\\", $storeKey));
    $hashval = $hashval . $escapedStoreKey;

    // SHA-512 algoritması kullanılıyor, ancak SHA-256 kullanılabilir.
    $calculatedHashValue = hash('sha512', $hashval);
    $actualHash = base64_encode(pack('H*', $calculatedHashValue));

    $retrievedHash = $_POST["HASH"];
    if ($retrievedHash == $actualHash) {


        if ($_SERVER["REQUEST_METHOD"] == "POST") {

            // Gerekli verileri POST içerisinden al
            $clientId = $_POST["clientid"] ?? "";
            $orderId = $_POST["md"] ?? "";
            $cavv = $_POST["cavv"] ?? "";
            $eci = $_POST["eci"] ?? "";
            $xid = $_POST["xid"] ?? "";
            $currency = $_POST["currency"] ?? "949";
            $amount = $_POST["amount"] ?? "0.00";

            // Buraya kendi İş Bankası bilgilerini gir
            $username = "enesunat";
            $password = "QAZplm213!!!";

            // XML formatını oluştur
            $xmlData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
            <CC5Request>
                <Name>{$username}</Name>
                <Password>{$password}</Password>
                <ClientId>{$clientId}</ClientId>
                <OrderId></OrderId>
                <GroupId></GroupId>
                <Type>Auth</Type>
                <Number>{$orderId}</Number>
                <PayerAuthenticationCode>{$cavv}</PayerAuthenticationCode>
                <PayerSecurityLevel>{$eci}</PayerSecurityLevel>
                <PayerTxnId>{$xid}</PayerTxnId>
                <Currency>{$currency}</Currency>
            </CC5Request>";

            // İş Bankası API endpointi
            $apiUrl = "https://sanalpos.isbank.com.tr/fim/api";

            // cURL ile POST isteği at
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $apiUrl);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $xmlData);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: text/xml"]);

            // API'den yanıtı al
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            // XML'i parse et
            $xml = simplexml_load_string($response);
            if (!$xml) {
                die("Geçersiz XML verisi");
            }
            $responseStatus = (string) $xml->Response;
            $orderId = (string) $_POST['oid']; // Sipariş ID'yi çek
            $amount = isset($_POST['amount']) ? $_POST['amount'] : '0.00';

            // Başarılıysa success URL'ine yönlendir
            if ($responseStatus === "Approved") {
                header("Location: https://tatilmerasi.com/Rezervasyon/OdemeBasarili?oid={$orderId}&amount={$amount}");
                exit;
            } else {
                header("Location:https://tatilmerasi.com/Rezervasyon/OdemeBasarisiz?oid={$orderId}&amount={$amount}");
                exit;
            }

        } else {
            echo "🚫 **POST isteği bekleniyor!**";
        }

    } else {
        header("Location: https://tatilmerasi.com/Rezervasyon/OdemeBasarisiz");
        exit;
    }
    ?>
</table>

</body>

</html>
