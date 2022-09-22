const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    "https://cpypixjgikqrdzyukphy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNweXBpeGpnaWtxcmR6eXVrcGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM4MzgyNjYsImV4cCI6MTk3OTQxNDI2Nn0.ej-AuEcn44TaXgzTXij9GlMexIFb0PIP7ix9txR0s8Y"
)
  
module.exports = supabase;