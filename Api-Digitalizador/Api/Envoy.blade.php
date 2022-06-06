@servers(['production' => 'root@157.230.9.6'])

@task('deploy')
    cd www/api
    git pull origin staging
    composer install --ignore-platform-reqs
    php artisan migrate:fresh --seed
@endtask
