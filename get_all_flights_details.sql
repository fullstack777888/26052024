SELECT flights.id, airline_companies.name, origin_countries.name as origin_country, destination_countries.name as destination_country  FROM flights
join airline_companies 
on airline_companies.id = flights.airline_company_id
join countries as origin_countries
on origin_countries.id = flights.origin_country_id
join countries as destination_countries
on destination_countries.id = flights.destination_country_id
