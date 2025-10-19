"use client";

import { Layout } from "@/components/layout/Layout";
import Odontogram from "@/components/Odontogram";

export default function OdontogramPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <Odontogram />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
