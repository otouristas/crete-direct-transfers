-- Expand allowed vehicle classes for driver profiles (SUV, vans, minibuses).

alter table public.driver_profiles
  drop constraint if exists driver_profiles_vehicle_class_check;

alter table public.driver_profiles
  add constraint driver_profiles_vehicle_class_check
  check (
    vehicle_class is null
    or vehicle_class in (
      'economy',
      'comfort',
      'luxury',
      'suv',
      'minivan',
      'van-first',
      'minibus-12',
      'minibus-16'
    )
  );
