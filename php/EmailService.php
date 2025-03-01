<?php
class EmailService {
    private static string $name = "PHP-LOJA";

    private static function randomCodeGenerator(int $size): string {
        return (string) substr(bin2hex(random_bytes(ceil($size / 2))), 0, $size);
    }


    private static function urlGenerator(string $url, string $title): string {
        if (!filter_var($url, FILTER_VALIDATE_URL)) return "URL inválida";

        return "<a href='" .
               htmlspecialchars($url, ENT_QUOTES, 'UTF-8')   . "'>" .
               htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . "</a>";
    }


    private static function defaultHeader(): string {
        return "From: no-reply@php-loja.com\r\n" .
               "Reply-To: no-reply@php-loja.com\r\n" .
               "X-Mailer: PHP/" . phpversion() . "\r\n" .
               "Content-Type: text/html; charset=UTF-8\r\n";
    }


    private static function verifyEmail(string $email): bool {
        $regex = "/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}(\.[a-z]{2,})?$/i";
        return (bool) preg_match($regex, $email);
    }


    static function sendVerificationEmail(string $toEmail, string $token): bool {
        if (!self::verifyEmail($toEmail)) return false;
        $url = "https://php-loja.com/AtivarEmail?token=";

        $subject  = self::$name . " - Confirmação de Cadastro";

        $message  = "<html><body>";
            $message .= "<p>Clique no link abaixo para confirmar seu cadastro:</p>";
            $message .= self::urlGenerator($url . urlencode($token), "Ativar email");
        $message .= "</body></html>";

        $headers  = self::defaultHeader();

        return mail($toEmail, $subject, $message, $headers);
    }


    static function sendCodeResetEmail(string $toEmail): string {
        if (!self::verifyEmail($toEmail)) return "00000";

        $subject = self::$name . " - Código de Verificação";
        $code = self::randomCodeGenerator(5);
        
        $message = "
        <html>
        <head>
            <style>
                body {
                     font-family: Arial, sans-serif;
                     background-color: #f4f4f4;
                     text-align: center;
                     padding: 20px; 
                }
                .container {
                     max-width: 500px;
                     background: white;
                     padding: 20px;
                     border-radius: 8px;
                     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                     margin: auto; 
                }

                h2 { color: #333; }
                .code { font-size: 24px;
                     font-weight: bold;
                     background: #ddd;
                     padding: 10px;
                     display: inline-block;
                     border-radius: 5px;
                }
                p { color: #555; }
            </style>
        </head>
        <body>
            <div class='container'>
                <h2>{$subject}</h2>
                <p>Use o código abaixo para redefinir sua senha:</p>
                <div class='code'>{$code}</div>
                <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
            </div>
        </body>
        </html>
        ";

        $headers = self::defaultHeader();

        if (mail($toEmail, $subject, $message, $headers)){
            return $code;
        }

        return "00000";
    }

}
?>
