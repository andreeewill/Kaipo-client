# Kaipo Client - Dental Clinic Management System

A modern, comprehensive dental clinic management system built with Next.js, React, and TypeScript.

## 🚀 Features

### Patient Management
- **Daftar Reservasi**: Complete patient reservation management
- **WhatsApp & Walk-in Registration**: Dedicated forms for different registration sources
- **Patient Calendar**: Google Calendar-style view with date and hourly timelines
- **Queue Management**: Track patient encounter queues

### Scheduling & Calendar
- **Patient Calendar View**: 
  - Month view with patient count badges
  - Day view with hourly timeline (7 AM - 9 PM)
  - Week view for overview
  - Color-coded by status
  - Interactive event details

### Medical Records (RME)
- Electronic medical record management
- Patient history tracking
- AI-powered diagnosis assistance
- Odontogram visualization

### Special Features
- **AI Diagnosis**: Intelligent diagnostic assistance
- **Odontogram**: Interactive dental chart
- **Real-time Updates**: Auto-refreshing data with React Query

## 📦 Tech Stack

- **Framework**: Next.js 15.3.1 (App Router)
- **Language**: TypeScript 5.8.3
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.1.4
- **State Management**: Zustand 5.0.3
- **Data Fetching**: TanStack Query (React Query) 5.89.0
- **HTTP Client**: Axios 1.12.2
- **Date Handling**: date-fns 4.1.0
- **Calendar**: react-big-calendar 1.18.0
- **UI Components**: Radix UI + Shadcn/ui
- **Icons**: Lucide React

## 🛠️ Installation

1. Clone the repository
```bash
git clone https://github.com/andreeewill/Kaipo-client.git
cd Kaipo-client
```

2. Install dependencies
```bash
pnpm install
```

3. Run development server
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Kaipo-client/
├── app/                          # Next.js app directory
│   ├── dashboard/               # Main dashboard pages
│   │   ├── basic-patients/     # Patient reservations
│   │   ├── patient-calendar/   # Calendar view
│   │   ├── queue-management/   # Queue system
│   │   └── ...
│   ├── medical-record/         # Medical records
│   └── layout.tsx              # Root layout
├── components/                  # React components
│   ├── layout/                 # Layout components
│   │   ├── AppSidebar.tsx      # Main navigation sidebar
│   │   └── Layout.tsx          # Page layout wrapper
│   ├── PatientCalendar.tsx     # Reusable calendar component
│   ├── WhatsAppRegistrationForm.tsx
│   ├── LoadingSpinner.tsx      # Navigation loading states
│   └── ui/                     # Shadcn UI components
├── lib/                        # Utilities and configurations
│   └── queries/                # React Query setup
│       ├── hooks/              # Custom query hooks
│       ├── mutations/          # Mutation hooks
│       └── types/              # TypeScript types
├── hooks/                      # Custom React hooks
└── styles/                     # Global styles
```

## 🎯 Key Components

### PatientCalendar
Reusable Google Calendar-style component with:
- Multiple view modes (Month, Week, Day)
- Patient count indicators
- Color-coded status
- Interactive event details
- Real-time updates

See [PATIENT_CALENDAR.md](./PATIENT_CALENDAR.md) for detailed documentation.

### WhatsAppRegistrationForm
Dedicated registration form for WhatsApp and Walk-in patients with:
- Patient information capture
- Branch and doctor selection
- Date and time slot booking
- Source-specific branding

### LoadingSpinner
Navigation loading indicators:
- Top loading bar (YouTube-style)
- Full-screen spinner option
- Auto-triggered on route changes

See [LOADING_SPINNER.md](./LOADING_SPINNER.md) for implementation details.

## 📚 Documentation

- [Patient Calendar Documentation](./PATIENT_CALENDAR.md)
- [Loading Spinner Documentation](./LOADING_SPINNER.md)
- [React Query Guide](./REACT_QUERY_GUIDE.md)

## 🔧 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint and TypeScript checks

## 🌐 Navigation Structure

```
Dashboard
├── Pendaftaran (Registration)
│   ├── Daftar Reservasi (Reservations)
│   ├── Daftar Reservasi (Appointment Management)
│   ├── Antrian Encounter (Queue)
│   └── Kalender Pasien (Patient Calendar) ⭐ NEW
├── RME (Medical Records)
└── Fitur Khusus (Special Features)
    ├── Odontogram
    └── AI Diagnosis
```

## 🎨 Theme Colors

- Primary: `#31572c` (Dark Green)
- Secondary: `#4f772d` (Medium Green)
- Accent: `#90a955` (Light Green)
- Highlight: `#ecf39e` (Pale Yellow)

## 🔐 Authentication

Uses Zustand for authentication state management. Auth integration is currently prepared but commented out.

## 📱 Responsive Design

Fully responsive with:
- Mobile-first approach
- Collapsible sidebar (mobile: icons only)
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

## 🚧 Development Status

Active development with regular updates. See [todo.md](./todo.md) for current tasks.

## 📄 License

ISC

## 👥 Repository

- **Owner**: andreeewill
- **Repository**: [Kaipo-client](https://github.com/andreeewill/Kaipo-client)

---

Built with ❤️ for modern dental clinic management
