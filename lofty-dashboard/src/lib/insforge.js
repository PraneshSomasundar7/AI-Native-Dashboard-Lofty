import { createClient } from '@insforge/sdk'

export const insforge = createClient({
  baseUrl: 'https://8bxmrdgz.us-west.insforge.app',
  anonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NjY2MDR9.FMHpZN0AXrmidMv-mcxKcV0fjiJ9pUFFB4vn2eVzUTM',
})
