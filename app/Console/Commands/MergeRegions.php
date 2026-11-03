<?php

namespace App\Console\Commands;

use App\Models\City;
use App\Models\District;
use App\Models\Region;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MergeRegions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'merge:regions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // illlerde veriyi ilçelere ekle tüm verileri slugla nameınden otomatık

        $districts = District::all();
        $cities = City::all();
        foreach ($cities as $city) {
            $regionData = [
                "name" => $city->name,
                "city" => null,
                "slug" => Str::slug($city->name)
            ];
            $Region = Region::updateOrCreate($regionData);
            echo "Veri Eklendi. Eklenen veri: $Region->slug\n";
        }

        foreach ($districts as $district) {
            $City = City::Where('id',$district->city_id)->first();
            $Name = $district->name. " " . $City->name;
            $regionData = [
                "name" => $district->name,
                "city" => $district->city_id,
            ];
            $Region = Region::updateOrCreate(
                ["slug" => Str::slug($Name)],
                $regionData);
            echo "Veri Eklendi. Eklenen veri: $Region->slug\n";
        }


    }
}
