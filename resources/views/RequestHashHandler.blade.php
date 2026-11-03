<html>
<head>
    <title>3D Secure Yönlendirme</title>
    <meta http-equiv="Content-Language" content="tr">
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-9">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="now">
</head>

<body onload="javascript:moveWindow()">

<form name="pay_form" method="post" action="https://sanalpos.isbank.com.tr/fim/est3Dgate">
    <?php
    $postParams = array();
    foreach (request()->all() as $key => $value) {
        array_push($postParams, $key);
        echo "<input type=\"hidden\" name=\"" . htmlspecialchars($key) . "\" value=\"" . htmlspecialchars($value) . "\" />";
    }

    natcasesort($postParams);

    $hashval = "";
    foreach ($postParams as $param) {
        $paramValue = request()->$param;
        $escapedParamValue = str_replace("|", "\\|", str_replace("\\", "\\\\", $paramValue));

        $lowerParam = strtolower($param);
        if ($lowerParam != "hash" && $lowerParam != "encoding") {
            $hashval = $hashval . $escapedParamValue . "|";
        }
    }

    $storeKey = "cnEQrujQR5YRJBs1!"; // Store Key buraya yazılmalı
    $escapedStoreKey = str_replace("|", "\\|", str_replace("\\", "\\\\", $storeKey));
    $hashval = $hashval . $escapedStoreKey;

    $calculatedHashValue = hash('sha512', $hashval);
    $hash = base64_encode(pack('H*', $calculatedHashValue));

    echo "<input type=\"hidden\" name=\"HASH\" value=\"" . htmlspecialchars($hash) . "\" />";
    ?>
</form>

<script type="text/javascript" language="javascript">
    function moveWindow() {
        document.pay_form.submit();
    }
</script>

</body>
</html>

