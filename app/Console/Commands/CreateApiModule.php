<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class CreateApiModule extends Command
{
    protected $signature = 'module:create-api {name}';
    protected $description = 'API entegrasyonu için yeni bir modül oluşturur';

    protected $baseNamespace = 'App\\Modules\\ApiModule';

    public function handle()
    {
        $name = Str::studly($this->argument('name'));
        $this->info("API Modülü Oluşturuluyor: $name\n");

        // Kullanıcıdan oluşturulacak bileşenleri seçmesini iste
        $components = $this->choice(
            'Hangi bileşenleri oluşturmak istiyorsunuz? (Birden fazla seçim için virgül ile ayırın)',
            [
                'Hepsi',
                'Interface',
                'Repository',
                'Operation',
                'DTO',
                'Config',
                'Exception',
                'Test'
            ],
            0,
            multiple: true
        );

        if (in_array('Hepsi', $components)) {
            $components = [
                'Interface',
                'Repository',
                'Operation',
                'DTO',
                'Config',
                'Exception',
                'Test'
            ];
        }

        // Ana modül dizinini oluştur
        $modulePath = app_path("Modules/ApiModule/$name");
        if (!File::exists($modulePath)) {
            File::makeDirectory($modulePath, 0755, true);
        }

        foreach ($components as $component) {
            $method = 'create' . $component;
            if (method_exists($this, $method)) {
                $this->$method($modulePath, $name);
            }
        }

        $this->info("\n$name API Modülü başarıyla oluşturuldu! -👁️ Founder 🚀");
    }

    protected function createInterface($path, $name)
    {
        $directory = "$path/Contracts";
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $content = <<<PHP
<?php

namespace {$this->baseNamespace}\\$name\\Contracts;

interface {$name}ClientInterface
{
    /**
     * GET isteği gönder
     */
    public function get(string \$endpoint, array \$params = []): array;

    /**
     * POST isteği gönder
     */
    public function post(string \$endpoint, array \$data = []): array;

    /**
     * PUT isteği gönder
     */
    public function put(string \$endpoint, array \$data = []): array;

    /**
     * DELETE isteği gönder
     */
    public function delete(string \$endpoint): array;
}
PHP;

        File::put("$directory/{$name}ClientInterface.php", $content);
        $this->info("Interface oluşturuldu: {$name}ClientInterface.php");
    }

    protected function createRepository($path, $name)
    {
        $directory = "$path/Repositories";
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $content = <<<PHP
<?php

namespace {$this->baseNamespace}\\$name\\Repositories;

use {$this->baseNamespace}\\$name\\Contracts\\{$name}ClientInterface;
use {$this->baseNamespace}\\$name\\Exceptions\\{$name}ApiException;

class {$name}Repository
{
    protected \${$name}Client;
    protected string \$baseUrl;

    public function __construct({$name}ClientInterface \$client)
    {
        \$this->{$name}Client = \$client;
        \$this->baseUrl = config('{$name}.base_url');
    }

    /**
     * API isteğini yönet
     */
    protected function handleRequest(callable \$request)
    {
        try {
            return \$request();
        } catch (\\Exception \$e) {
            throw new {$name}ApiException("API isteği başarısız: " . \$e->getMessage());
        }
    }

    /**
     * Örnek API metodu
     */
    public function getData(array \$params = []): array
    {
        return \$this->handleRequest(function () use (\$params) {
            return \$this->{$name}Client->get('/endpoint', \$params);
        });
    }
}
PHP;

        File::put("$directory/{$name}Repository.php", $content);
        $this->info("Repository oluşturuldu: {$name}Repository.php");
    }

    protected function createService($path, $name)
    {
        $directory = "$path/Services";
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $content = <<<PHP
<?php

namespace {$this->baseNamespace}\\$name\\Services;

use {$this->baseNamespace}\\$name\\Repositories\\{$name}Repository;
use {$this->baseNamespace}\\$name\\DTOs\\{$name}DTO;

class {$name}Operation
{
    protected {$name}Repository \$repository;

    public function __construct({$name}Repository \$repository)
    {
        \$this->repository = \$repository;
    }

    /**
     * Örnek servis metodu
     */
    public function process{$name}Data({$name}DTO \$dto): array
    {
        return \$this->repository->getData(\$dto->toArray());
    }
}
PHP;

        File::put("$directory/{$name}Operation.php", $content);
        $this->info("Operation oluşturuldu: {$name}Operation.php");
    }

    protected function createDTO($path, $name)
    {
        $directory = "$path/DTOs";
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $content = <<<PHP
<?php

namespace {$this->baseNamespace}\\$name\\DTOs;

class {$name}DTO
{
    protected array \$data;

    public function __construct(array \$data = [])
    {
        \$this->data = \$data;
    }

    public function toArray(): array
    {
        return \$this->data;
    }
}
PHP;

        File::put("$directory/{$name}DTO.php", $content);
        $this->info("DTO oluşturuldu: {$name}DTO.php");
    }

    protected function createConfig($path, $name)
    {
        $configPath = config_path(strtolower($name) . '.php');

        $content = <<<PHP
<?php

return [
    'base_url' => env('{$name}_API_BASE_URL', 'https://api.example.com'),
    'api_key' => env('{$name}_API_KEY'),
    'timeout' => env('{$name}_API_TIMEOUT', 30),
    'retry_attempts' => env('{$name}_API_RETRY_ATTEMPTS', 3),
];
PHP;

        File::put($configPath, $content);
        $this->info("Config dosyası oluşturuldu: " . basename($configPath));
    }

    protected function createException($path, $name)
    {
        $directory = "$path/Exceptions";
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $content = <<<PHP
<?php

namespace {$this->baseNamespace}\\$name\\Exceptions;

class {$name}ApiException extends \\Exception
{
    protected array \$errors = [];

    public function setErrors(array \$errors): self
    {
        \$this->errors = \$errors;
        return \$this;
    }

    public function getErrors(): array
    {
        return \$this->errors;
    }
}
PHP;

        File::put("$directory/{$name}ApiException.php", $content);
        $this->info("Exception sınıfı oluşturuldu: {$name}ApiException.php");
    }

    protected function createTest($path, $name)
    {
        $directory = base_path("tests/Feature/Modules/ApiModule/$name");
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $content = <<<PHP
<?php

namespace Tests\\Feature\\Modules\\ApiModule\\$name;

use Tests\\TestCase;
use {$this->baseNamespace}\\$name\\Services\\{$name}Operation;
use {$this->baseNamespace}\\$name\\Repositories\\{$name}Repository;

class {$name}Test extends TestCase
{
    protected {$name}Operation \$service;
    protected {$name}Repository \$repository;

    protected function setUp(): void
    {
        parent::setUp();

        \$this->repository = \$this->mock({$name}Repository::class);
        \$this->service = new {$name}Operation(\$this->repository);
    }

    /** @test */
    public function it_can_process_api_data()
    {
        // Test senaryonuzu buraya yazın
        \$this->assertTrue(true);
    }
}
PHP;

        File::put("$directory/{$name}Test.php", $content);
        $this->info("Test sınıfı oluşturuldu: {$name}Test.php");
    }
}
