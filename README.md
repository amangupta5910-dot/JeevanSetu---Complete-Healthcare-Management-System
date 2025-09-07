# MediCare - Complete Healthcare Management System

A comprehensive ambulance booking and tracking system with additional healthcare features including doctor appointments, video consultations, hospital directory, and medicine delivery.

## 🚀 Features

### Core Features
- **🚑 Ambulance Booking & Real-time Tracking**
  - Book different types of ambulances (Basic, Advanced, ICU, Mortuary)
  - Real-time ambulance tracking with live location updates
  - Multiple emergency type selection
  - Driver details and ETA tracking
  - Trip progress monitoring

- **👨‍⚕️ Doctor Appointment Booking**
  - Browse and book appointments with specialist doctors
  - View doctor profiles, experience, and ratings
  - Calendar-based scheduling with available time slots
  - Appointment confirmation and reminders
  - Medical history and symptoms tracking

- **📹 Video Consultation**
  - Schedule video consultations with doctors
  - HD quality video calls with medical professionals
  - Prescription generation during consultation
  - Meeting link generation and calendar integration
  - Consultation history and records

- **🏥 Hospital Directory**
  - Comprehensive hospital database with filtering
  - Search by specialty, location, and rating
  - Hospital facilities and bed availability
  - Doctor availability and contact information
  - Patient reviews and ratings

- **💊 Medicine Ordering & Delivery**
  - Browse and order medicines from verified hospitals
  - Prescription upload and validation
  - Real-time stock availability checking
  - Home delivery with tracking
  - Discount offers and subscription options

### Additional Features
- **🔐 User Authentication & Profile Management**
  - Secure user registration and login
  - Role-based access (Patient, Doctor, Hospital Staff, Admin)
  - Profile management with medical history
  - Order and appointment history

- **📱 Responsive Design**
  - Mobile-first design approach
  - Works seamlessly on all devices
  - Intuitive user interface
  - Fast loading and optimized performance

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts

### Backend
- **Database**: SQLite with Prisma ORM
- **API**: Next.js API Routes
- **Real-time**: Socket.IO for live tracking
- **Authentication**: NextAuth.js (ready to implement)
- **File Upload**: Built-in support for prescriptions

### Development Tools
- **Code Quality**: ESLint with Next.js rules
- **Type Safety**: Strict TypeScript configuration
- **Database Management**: Prisma Studio
- **Development Server**: Nodemon with hot reload

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd my-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### 4. Database Setup
```bash
# Setup database schema and seed data
npm run db:setup

# This command runs:
# - prisma db push (creates schema)
# - prisma generate (generates client)
# - tsx prisma/seed.ts (seeds sample data)
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🗂️ Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── ambulance/           # Ambulance booking APIs
│   │   ├── doctor-appointment/ # Doctor appointment APIs
│   │   ├── video-consultation/ # Video consultation APIs
│   │   ├── hospitals/          # Hospital directory APIs
│   │   ├── medicine-order/     # Medicine order APIs
│   │   └── health/             # Health check API
│   ├── ambulance/              # Ambulance booking page
│   ├── doctor/                 # Doctor appointment page
│   ├── video-consultation/     # Video consultation page
│   ├── hospitals/              # Hospital directory page
│   ├── medicine/               # Medicine ordering page
│   ├── auth/                   # Authentication page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/                 # Reusable UI components
│   └── ui/                     # shadcn/ui components
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries
│   ├── db.ts                  # Database connection
│   ├── socket.ts              # Socket.IO configuration
│   └── utils.ts               # Utility functions
└── prisma/                     # Database schema and migrations
    ├── schema.prisma          # Database schema
    └── seed.ts               # Seed data
```

## 🚀 Usage

### Accessing Features

1. **Home Page**: `http://localhost:3000`
   - Overview of all services
   - Quick access to emergency ambulance booking
   - Service statistics and highlights

2. **Ambulance Booking**: `http://localhost:3000/ambulance`
   - Book ambulances with real-time tracking
   - Select ambulance type and emergency type
   - Track ambulance location and trip progress

3. **Doctor Appointments**: `http://localhost:3000/doctor`
   - Browse doctors by specialty
   - Book appointments with available time slots
   - View appointment history and details

4. **Video Consultation**: `http://localhost:3000/video-consultation`
   - Schedule video consultations
   - Join video calls with doctors
   - Access consultation history

5. **Hospital Directory**: `http://localhost:3000/hospitals`
   - Search and filter hospitals
   - View hospital details and facilities
   - Check doctor availability

6. **Medicine Ordering**: `http://localhost:3000/medicine`
   - Browse medicines by category
   - Add to cart and place orders
   - Track delivery status

7. **Authentication**: `http://localhost:3000/auth`
   - User registration and login
   - Profile management

### API Endpoints

#### Ambulance Service
- `POST /api/ambulance` - Book ambulance
- `GET /api/ambulance` - Get bookings
- `PATCH /api/ambulance` - Update booking status

#### Doctor Appointments
- `POST /api/doctor-appointment` - Book appointment
- `GET /api/doctor-appointment` - Get appointments
- `PATCH /api/doctor-appointment` - Update appointment
- `DELETE /api/doctor-appointment` - Cancel appointment

#### Video Consultation
- `POST /api/video-consultation` - Schedule consultation
- `GET /api/video-consultation` - Get consultations
- `PATCH /api/video-consultation` - Update consultation
- `DELETE /api/video-consultation` - Cancel consultation

#### Hospital Directory
- `GET /api/hospitals` - Get hospitals
- `POST /api/hospitals` - Add hospital
- `PATCH /api/hospitals` - Update hospital
- `DELETE /api/hospitals` - Delete hospital

#### Medicine Orders
- `POST /api/medicine-order` - Place order
- `GET /api/medicine-order` - Get orders
- `PATCH /api/medicine-order` - Update order status
- `DELETE /api/medicine-order` - Cancel order

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users**: Patient, Doctor, Hospital Staff, Admin
- **Hospitals**: Hospital information and facilities
- **Doctors**: Doctor profiles and specializations
- **Ambulances**: Ambulance fleet and tracking
- **Medicines**: Medicine inventory and pricing
- **AmbulanceBookings**: Ambulance booking records
- **DoctorAppointments**: Appointment scheduling
- **VideoConsultations**: Telemedicine sessions
- **MedicineOrders**: Medicine ordering and delivery
- **Reviews**: Patient feedback and ratings

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Trust and professionalism
- **Secondary**: Green (#10B981) - Health and wellness
- **Emergency**: Red (#EF4444) - Urgency and emergencies
- **Accent**: Purple (#8B5CF6) - Innovation and technology
- **Neutral**: Gray shades for text and backgrounds

### UI Components
- Built with shadcn/ui component library
- Consistent spacing and typography
- Responsive design patterns
- Accessible color contrasts
- Hover and focus states

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database
npm run db:seed      # Seed database
npm run db:setup     # Full database setup

# Code Quality
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Digital Ocean
- AWS

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention with Prisma ORM
- XSS protection with Next.js built-in features
- CSRF protection ready for NextAuth.js
- Environment variable configuration
- Secure password handling

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1440px+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ using Next.js, Prisma, and modern web technologies.**