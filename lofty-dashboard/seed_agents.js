import { createClient } from '@insforge/sdk'

const client = createClient({
  baseUrl: 'https://8bxmrdgz.us-west.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NjY2MDR9.FMHpZN0AXrmidMv-mcxKcV0fjiJ9pUFFB4vn2eVzUTM',
})
const db = client.database

// ── Agents to remove ──────────────────────────────────────────────────────────
const OLD_EMAILS = ['agent1@gmail.com', 'agent2@gmail.com', 'agent3@gmail.com']

// ── New agents ────────────────────────────────────────────────────────────────
const AGENTS = [
  { email: 'agent6@gmail.com',  password: 'agent123', full_name: 'Agent6',  role: 'agent' },
  { email: 'agent7@gmail.com',  password: 'agent123', full_name: 'Agent7',  role: 'agent' },
  { email: 'agent8@gmail.com',  password: 'agent123', full_name: 'Agent8',  role: 'agent' },
  { email: 'agent9@gmail.com',  password: 'agent123', full_name: 'Agent9',  role: 'agent' },
  { email: 'agent10@gmail.com', password: 'agent123', full_name: 'Agent10', role: 'agent' },
]

// ── 25 properties (5 per agent) ───────────────────────────────────────────────
const PROPERTIES = [
  // ── Sarah Mitchell (agent6) ── Austin, TX
  {
    title: '123 Maple Grove Drive',
    price: 485000,
    agent_email: 'agent6@gmail.com',
    agent_name: 'Agent6',
    image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    location: 'Austin, TX',
    specs: '3 bed, 2 bath, 1,650 sqft',
    description: 'Charming craftsman-style home on a tree-lined street in the heart of Austin. Updated kitchen with granite countertops, hardwood floors throughout, and a private backyard with mature oak trees. Walking distance to top-rated schools and local restaurants.',
  },
  {
    title: '456 Sunset Ridge Blvd',
    price: 729000,
    agent_email: 'agent6@gmail.com',
    agent_name: 'Agent6',
    image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    location: 'Austin, TX',
    specs: '4 bed, 3 bath, 2,400 sqft',
    description: 'Stunning contemporary home with panoramic hill country views. Open-concept living with soaring ceilings, a chef\'s kitchen, and a resort-style pool. The primary suite features a spa bath and walk-in closet. Smart home technology throughout.',
  },
  {
    title: '789 Lakeside Court',
    price: 1150000,
    agent_email: 'agent6@gmail.com',
    agent_name: 'Agent6',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    location: 'Austin, TX',
    specs: '5 bed, 4 bath, 3,200 sqft',
    description: 'Luxury lakefront estate with private dock access. Expansive open floor plan with floor-to-ceiling windows showcasing breathtaking water views. Gourmet kitchen, home theater, wine cellar, and 3-car garage. An entertainer\'s dream property.',
  },
  {
    title: '234 Willow Creek Lane',
    price: 398000,
    agent_email: 'agent6@gmail.com',
    agent_name: 'Agent6',
    image_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
    location: 'Cedar Park, TX',
    specs: '3 bed, 2 bath, 1,480 sqft',
    description: 'Move-in ready family home in a highly sought-after Cedar Park neighborhood. Features an updated kitchen, spacious backyard with deck, and a two-car garage. Minutes from the new Domain shopping and dining district. Excellent schools.',
  },
  {
    title: '567 Copper Canyon Way',
    price: 562000,
    agent_email: 'agent6@gmail.com',
    agent_name: 'Agent6',
    image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    location: 'Round Rock, TX',
    specs: '4 bed, 2.5 bath, 2,100 sqft',
    description: 'Beautiful two-story home in a quiet cul-de-sac. Bright open layout with a formal dining room, large game room upstairs, and a fully fenced backyard. Community pool and playground included. Excellent Round Rock ISD schools.',
  },

  // ── Marcus Chen (agent7) ── San Diego, CA
  {
    title: '890 Harbor View Place',
    price: 1250000,
    agent_email: 'agent7@gmail.com',
    agent_name: 'Agent7',
    image_url: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80',
    location: 'San Diego, CA',
    specs: '4 bed, 3 bath, 2,600 sqft',
    description: 'Exceptional coastal home with sweeping bay views from every level. Custom finishes include wide-plank oak floors, Carrara marble countertops, and designer light fixtures. Roof deck perfect for entertaining. Steps to world-class beaches.',
  },
  {
    title: '321 Pacific Terrace',
    price: 2100000,
    agent_email: 'agent7@gmail.com',
    agent_name: 'Agent7',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    location: 'La Jolla, CA',
    specs: '5 bed, 4 bath, 3,800 sqft',
    description: 'Prestigious La Jolla estate perched on the bluffs with unobstructed ocean views. Architect-designed with seamless indoor-outdoor living. Infinity pool, fully equipped outdoor kitchen, and a private guest casita. Minutes from La Jolla Cove.',
  },
  {
    title: '654 Bayfront Drive',
    price: 3400000,
    agent_email: 'agent7@gmail.com',
    agent_name: 'Agent7',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    location: 'Coronado, CA',
    specs: '6 bed, 5 bath, 5,200 sqft',
    description: 'Iconic Coronado bayfront estate with a private dock. This custom masterpiece features a grand foyer, a commercial-grade kitchen, and a home gym. The primary suite spans the entire second floor with breathtaking views of downtown San Diego.',
  },
  {
    title: '987 Coastal Ridge Road',
    price: 895000,
    agent_email: 'agent7@gmail.com',
    agent_name: 'Agent7',
    image_url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80',
    location: 'Encinitas, CA',
    specs: '3 bed, 2 bath, 1,950 sqft',
    description: 'Charming coastal cottage just blocks from the Pacific. Newly remodeled with an open kitchen, vaulted ceilings, and a wraparound deck. The lush backyard features a spa and mature avocado trees. Surf and sunsets await every day.',
  },
  {
    title: '147 Surf View Lane',
    price: 1480000,
    agent_email: 'agent7@gmail.com',
    agent_name: 'Agent7',
    image_url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80',
    location: 'Carlsbad, CA',
    specs: '4 bed, 3.5 bath, 2,900 sqft',
    description: 'Gorgeous newer construction in a premier Carlsbad location with ocean views. Gourmet kitchen with waterfall island, butler\'s pantry, and a sun-drenched great room. Fourth bedroom ideal as home office. Walking distance to Carlsbad Village.',
  },

  // ── Emily Rodriguez (agent8) ── Miami, FL
  {
    title: '258 Brickell Bay Drive',
    price: 875000,
    agent_email: 'agent8@gmail.com',
    agent_name: 'Agent8',
    image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    location: 'Miami, FL',
    specs: '3 bed, 2 bath, 1,800 sqft',
    description: 'Sophisticated urban residence in the heart of Brickell with stunning bay and city skyline views. Features a chef\'s kitchen, floor-to-ceiling glass, and private balconies off every bedroom. Full-service building with pool, gym, and concierge.',
  },
  {
    title: '369 South Beach Avenue',
    price: 1650000,
    agent_email: 'agent8@gmail.com',
    agent_name: 'Agent8',
    image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    location: 'Miami Beach, FL',
    specs: '4 bed, 3 bath, 2,400 sqft',
    description: 'South Beach penthouse with wraparound terrace and direct ocean views. Fully renovated with Italian marble, custom cabinetry, and a designer master bath. Steps from Ocean Drive, world-class dining, and iconic Art Deco nightlife.',
  },
  {
    title: '741 Coconut Grove Way',
    price: 2250000,
    agent_email: 'agent8@gmail.com',
    agent_name: 'Agent8',
    image_url: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=800&q=80',
    location: 'Miami, FL',
    specs: '5 bed, 4 bath, 3,600 sqft',
    description: 'Stunning tropical modern estate nestled among lush Coconut Grove foliage. Private pool and outdoor kitchen, imported stone floors, and a two-story atrium with skylight. A rare offering in one of Miami\'s most coveted neighborhoods.',
  },
  {
    title: '852 Coral Gables Blvd',
    price: 1100000,
    agent_email: 'agent8@gmail.com',
    agent_name: 'Agent8',
    image_url: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=800&q=80',
    location: 'Coral Gables, FL',
    specs: '4 bed, 3 bath, 2,800 sqft',
    description: 'Classic Mediterranean-style home on a wide, tree-lined boulevard in the City Beautiful. Original architectural details meet modern updates: renovated kitchen, resort pool, summer kitchen. A+ rated schools and close to Merrick Park shops.',
  },
  {
    title: '963 Key Biscayne Road',
    price: 4500000,
    agent_email: 'agent8@gmail.com',
    agent_name: 'Agent8',
    image_url: 'https://images.unsplash.com/photo-1600566753151-384129cf4d3a?auto=format&fit=crop&w=800&q=80',
    location: 'Key Biscayne, FL',
    specs: '6 bed, 5 bath, 5,800 sqft',
    description: 'Ultra-luxury waterfront compound on Key Biscayne\'s most exclusive street. Private deepwater dock, resort-style pool, full outdoor kitchen, and six-car garage. Interior designed by a renowned Miami firm. An island paradise unlike any other.',
  },

  // ── David Thompson (agent9) ── Nashville, TN
  {
    title: '159 Broadway Heights Lane',
    price: 425000,
    agent_email: 'agent9@gmail.com',
    agent_name: 'Agent9',
    image_url: 'https://images.unsplash.com/photo-1606402179428-a57976d71fa4?auto=format&fit=crop&w=800&q=80',
    location: 'Nashville, TN',
    specs: '3 bed, 2 bath, 1,550 sqft',
    description: 'Adorable bungalow just minutes from downtown Nashville\'s vibrant music scene. Fully updated with quartz counters, subway tile, and new hardwood floors. Private fenced backyard perfect for entertaining. Walk to the Gulch and SoBro districts.',
  },
  {
    title: '357 Music Row Place',
    price: 685000,
    agent_email: 'agent9@gmail.com',
    agent_name: 'Agent9',
    image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    location: 'Nashville, TN',
    specs: '4 bed, 3 bath, 2,200 sqft',
    description: 'Modern farmhouse nestled in the heart of 12 South. Incredible chef\'s kitchen, whitewashed shiplap accent walls, and an oversized primary suite with soaking tub. Two-car detached garage and a private courtyard. Nashville\'s most walkable neighborhood.',
  },
  {
    title: '468 Green Hills Manor',
    price: 1200000,
    agent_email: 'agent9@gmail.com',
    agent_name: 'Agent9',
    image_url: 'https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?auto=format&fit=crop&w=800&q=80',
    location: 'Nashville, TN',
    specs: '5 bed, 4 bath, 3,400 sqft',
    description: 'Prestigious Green Hills estate with a gated circular drive. Grand two-story foyer, formal rooms, and a fully equipped chef\'s kitchen opening to a magnificent great room. Heated pool, cabana, and a four-car garage. Minutes from The Mall at Green Hills.',
  },
  {
    title: '579 Belle Meade Circle',
    price: 2800000,
    agent_email: 'agent9@gmail.com',
    agent_name: 'Agent9',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    location: 'Nashville, TN',
    specs: '6 bed, 5 bath, 4,900 sqft',
    description: 'One of Belle Meade\'s most distinguished addresses. This classic Georgian manor features original millwork, a barrel-vault wine cellar, a gunite pool, and three fireplaces. Set on over an acre of manicured grounds with mature magnolias.',
  },
  {
    title: '246 Franklin Park Drive',
    price: 595000,
    agent_email: 'agent9@gmail.com',
    agent_name: 'Agent9',
    image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    location: 'Franklin, TN',
    specs: '4 bed, 2.5 bath, 2,350 sqft',
    description: 'Lovely two-story home in a family-friendly Franklin neighborhood. Open kitchen with breakfast bar, spacious bonus room, and a primary suite with tray ceiling. Covered back porch and professionally landscaped yard. Top-rated Williamson County schools.',
  },

  // ── Jennifer Park (agent10) ── Seattle, WA
  {
    title: '135 Capitol Hill Way',
    price: 895000,
    agent_email: 'agent10@gmail.com',
    agent_name: 'Agent10',
    image_url: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=800&q=80',
    location: 'Seattle, WA',
    specs: '3 bed, 2 bath, 1,750 sqft',
    description: 'Sophisticated Capitol Hill craftsman with stunning Cascade Mountain views. Features a designer kitchen, period-correct built-ins, and a sun-drenched reading nook. Rare two-car garage. Steps to the best coffee, dining, and nightlife Seattle offers.',
  },
  {
    title: '246 Lake Union View',
    price: 1450000,
    agent_email: 'agent10@gmail.com',
    agent_name: 'Agent10',
    image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    location: 'Seattle, WA',
    specs: '4 bed, 3 bath, 2,500 sqft',
    description: 'Breathtaking contemporary home with unobstructed Lake Union and Space Needle views. Walls of glass frame the stunning vistas from the open great room and private primary suite deck. Wolf and Sub-Zero appliances, heated floors, and a rooftop terrace.',
  },
  {
    title: '357 Mercer Island Drive',
    price: 2800000,
    agent_email: 'agent10@gmail.com',
    agent_name: 'Agent10',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    location: 'Mercer Island, WA',
    specs: '5 bed, 4 bath, 4,100 sqft',
    description: 'Exceptional Mercer Island waterfront estate with 80 feet of private Lake Washington frontage, a dock, and a boat lift. Custom-built with hand-selected materials throughout. Outdoor living spaces on every level. Minutes by bridge to downtown Seattle.',
  },
  {
    title: '468 Bellevue Heights',
    price: 1850000,
    agent_email: 'agent10@gmail.com',
    agent_name: 'Agent10',
    image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    location: 'Bellevue, WA',
    specs: '4 bed, 3.5 bath, 3,200 sqft',
    description: 'Modern luxury estate in Bellevue\'s most coveted neighborhood. Custom finishes include Italian marble, wide-plank white oak floors, and Miele appliances. Covered outdoor kitchen, pool-ready backyard, and a bonus room wired for home theater.',
  },
  {
    title: '579 Redmond Ridge Road',
    price: 1100000,
    agent_email: 'agent10@gmail.com',
    agent_name: 'Agent10',
    image_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
    location: 'Redmond, WA',
    specs: '4 bed, 3 bath, 2,600 sqft',
    description: 'Impeccably maintained Redmond Ridge home with peaceful greenbelt views. Spacious kitchen with eat-in island, formal dining room, and an upstairs primary retreat with spa bath. Community pools and trails. Minutes from Microsoft and Amazon campuses.',
  },
]

async function seed() {
  console.log('🌱  Starting seed...\n')

  // ── 1. Remove agent1/2/3 properties ─────────────────────────────────────────
  console.log('🗑   Removing agent1–3 properties...')
  const { error: e1 } = await db.from('PropertyDetails').delete().in('agent_email', OLD_EMAILS)
  if (e1) console.warn('    ⚠ Could not delete old properties:', e1.message)
  else    console.log('    ✓ Done.')

  // ── 2. Remove agent1/2/3 profiles ───────────────────────────────────────────
  console.log('🗑   Removing agent1–3 profiles...')
  const { error: e2 } = await db.from('profiles').delete().in('email', OLD_EMAILS)
  if (e2) console.warn('    ⚠ Could not delete old profiles:', e2.message)
  else    console.log('    ✓ Done.')

  // ── 3. Insert agent6–10 profiles (skip if already exist) ────────────────────
  console.log('\n👤  Inserting new agent profiles...')
  for (const agent of AGENTS) {
    const { data: existing } = await db.from('profiles').select('id').eq('email', agent.email).maybeSingle()
    if (existing) { console.log(`    ↩ ${agent.email} already exists — skipping.`); continue }
    const { error } = await db.from('profiles').insert([agent])
    if (error) console.error(`    ✗ ${agent.email}:`, error.message)
    else       console.log(`    ✓ ${agent.full_name} <${agent.email}>`)
  }

  // ── 4. Insert 25 properties ──────────────────────────────────────────────────
  console.log('\n🏡  Inserting 25 properties (5 per agent)...')
  const { error: e3 } = await db.from('PropertyDetails').insert(PROPERTIES)
  if (e3) console.error('    ✗ Failed:', e3.message)
  else    console.log(`    ✓ ${PROPERTIES.length} properties inserted.`)

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log('\n✅  Seed complete!\n')
  console.log('Agent login credentials:')
  AGENTS.forEach(a => console.log(`    ${a.email.padEnd(22)} / agent123`))
}

seed()
