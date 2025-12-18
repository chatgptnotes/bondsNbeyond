// Script to insert demo products into Supabase
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const demoProducts = [
  {
    sku: 'BONDS N BEYOND-CARD-BASIC',
    name: 'Bonds N Beyond Basic Card',
    slug: 'bonds n beyond-basic-card',
    description: 'Start your digital networking journey with our Basic NFC card. Perfect for individuals and freelancers.',
    price: 29.99,
    compare_at_price: 39.99,
    currency: 'USD',
    stock_quantity: 100,
    low_stock_threshold: 10,
    images: [{ url: '/images/products/basic-card.png', alt: 'Bonds N Beyond Basic Card' }],
    features: [
      'NFC enabled',
      'Basic profile customization',
      'Share contact info instantly',
      'QR code backup'
    ],
    specifications: {
      material: 'PVC',
      dimensions: '85.6mm x 54mm',
      thickness: '0.76mm',
      nfc_type: 'NTAG215'
    },
    is_active: true,
    is_featured: false
  },
  {
    sku: 'BONDS N BEYOND-CARD-PRO',
    name: 'Bonds N Beyond Pro Card',
    slug: 'bonds n beyond-pro-card',
    description: 'Elevate your professional presence with our Pro NFC card. Ideal for business professionals and entrepreneurs.',
    price: 49.99,
    compare_at_price: 69.99,
    currency: 'USD',
    stock_quantity: 75,
    low_stock_threshold: 10,
    images: [{ url: '/images/products/pro-card.png', alt: 'Bonds N Beyond Pro Card' }],
    features: [
      'Premium NFC chip',
      'Advanced profile customization',
      'Analytics dashboard',
      'Multiple link sharing',
      'Custom branding',
      'Priority support'
    ],
    specifications: {
      material: 'Metal + PVC',
      dimensions: '85.6mm x 54mm',
      thickness: '0.84mm',
      nfc_type: 'NTAG424'
    },
    is_active: true,
    is_featured: true
  },
  {
    sku: 'BONDS N BEYOND-CARD-PREMIUM',
    name: 'Bonds N Beyond Premium Metal Card',
    slug: 'bonds n beyond-premium-metal-card',
    description: 'Make a lasting impression with our Premium Metal NFC card. The ultimate choice for executives and luxury branding.',
    price: 99.99,
    compare_at_price: 149.99,
    currency: 'USD',
    stock_quantity: 50,
    low_stock_threshold: 5,
    images: [{ url: '/images/products/premium-card.png', alt: 'Bonds N Beyond Premium Metal Card' }],
    features: [
      'Full metal construction',
      'Premium NFC chip',
      'Unlimited customization',
      'Advanced analytics',
      'Team management',
      'API access',
      'White-glove support',
      'Custom engraving'
    ],
    specifications: {
      material: 'Stainless Steel',
      dimensions: '85.6mm x 54mm',
      thickness: '0.8mm',
      nfc_type: 'NTAG424 DNA',
      finish: 'Brushed Metal'
    },
    is_active: true,
    is_featured: true
  }
]

async function insertDemoProducts() {
  console.log('🔗 Connecting to Supabase:', supabaseUrl)
  console.log('📦 Inserting demo products...\n')

  for (const product of demoProducts) {
    // Check if product already exists
    const { data: existing } = await supabase
      .from('products')
      .select('id, name')
      .eq('sku', product.sku)
      .single()

    if (existing) {
      console.log(`⏭️  Product already exists: ${product.name}`)
      continue
    }

    // Insert new product
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error(`❌ Error inserting ${product.name}:`, error.message)
    } else {
      console.log(`✅ Created: ${data.name} (${data.sku}) - $${data.price}`)
    }
  }

  console.log('\n🎉 Demo products insertion complete!')
}

insertDemoProducts()
