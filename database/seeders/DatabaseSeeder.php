<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PageSeeder::class,
            BranchSeeder::class,
            CourseMatcherSeeder::class,
            FaqSeeder::class,
            SettingSeeder::class,
            CountryUniversityCourseSeeder::class,
            BlogSeeder::class,
            EmployeeSeeder::class,
        ]);
    }
}
