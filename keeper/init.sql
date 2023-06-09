-- Perform initialisation tasks here, such as:
--  - setting permissions
--  - creating db tables
--  - copying in back-up data?

-- FIX COLUMN TYPES
CREATE TABLE forecast (
  last_updated VARCHAR(25),
  break_id VARCHAR(200),
  forecast_time VARCHAR(200), --this is probably a good primary key
  swell_info JSONB not null,
  wind_speed VARCHAR(200),
  wind_direction VARCHAR(200),
  wind_state VARCHAR(200)
);

CREATE TABLE breaks (
  break_id VARCHAR(200) PRIMARY KEY,
  region VARCHAR(150) not null
);

CREATE TABLE users (
  username VARCHAR(50),
  break_pref VARCHAR(200)
);

CREATE TABLE scrape (
  scrape_id uuid PRIMARY KEY,
  scrape_params JSON,
  spider_name VARCHAR(50) not null,
  completed BOOLEAN not null,
  start_time timestamp with time zone,
  end_time timestamp with time zone
);

INSERT INTO users (
  username,
  break_pref
) VALUES (
  'benny',
  'Park-Beach-1'
);

-- COPY forecast (
--   last_updated,
--   break_name,
--   forecast_time,
--   swell_info,
--   wind_speed,
--   wind_direction,
--   wind_state
-- ) FROM 'init.csv'
-- DELIMITER ','
-- CSV HEADER;