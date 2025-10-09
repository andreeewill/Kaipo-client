"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Toast from '@/components/Toast';
import { 
  useCreatePatient, 
  useProvinces, 
  useCities, 
  useDistricts, 
  useSubDistricts 
} from '@/lib/queries/hooks/usePatients';
import { CreatePatientRequest, PatientFormErrors } from '@/types/api';

interface PatientFormProps {
  onSuccess?: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CreatePatientRequest>({
    NIK: '',
    name: '',
    dob: '',
    birthPlace: '',
    gender: 'male',
    addressLine: '',
    provinceCode: '',
    provinceName: '',
    cityCode: '',
    cityName: '',
    districtName: '',
    districtCode: '',
    subDistrictCode: '',
    subDistrictName: '',
    rt: '',
    rw: '',
    postalCode: '',
    phone: '',
    email: '',
    citizenshipStatus: 'WNI',
  });

  const [errors, setErrors] = useState<PatientFormErrors>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // API hooks
  const createPatientMutation = useCreatePatient();
  const { data: provincesData, isLoading: provincesLoading } = useProvinces();
  const { data: citiesData, isLoading: citiesLoading } = useCities(formData.provinceCode);
  const { data: districtsData, isLoading: districtsLoading } = useDistricts(formData.cityCode);
  const { data: subDistrictsData, isLoading: subDistrictsLoading } = useSubDistricts(formData.districtCode);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: PatientFormErrors = {};

    // NIK validation (16 digits)
    if (!formData.NIK) {
      newErrors.NIK = 'NIK is required';
    } else if (!/^\d{16}$/.test(formData.NIK)) {
      newErrors.NIK = 'NIK must be exactly 16 digits';
    }

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.birthPlace.trim()) newErrors.birthPlace = 'Birth place is required';
    if (!formData.addressLine.trim()) newErrors.addressLine = 'Address is required';
    if (!formData.provinceCode) newErrors.provinceCode = 'Province is required';
    if (!formData.cityCode) newErrors.cityCode = 'City is required';
    if (!formData.districtCode) newErrors.districtCode = 'District is required';
    if (!formData.subDistrictCode) newErrors.subDistrictCode = 'Sub-district is required';
    if (!formData.rt.trim()) newErrors.rt = 'RT is required';
    if (!formData.rw.trim()) newErrors.rw = 'RW is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic Indonesian format)
    if (formData.phone && !/^(\+62|62|0)[0-9]{9,13}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Indonesian phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof CreatePatientRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle province selection
  const handleProvinceChange = (provinceCode: string) => {
    const province = provincesData?.data.find(p => p.provinceCode === provinceCode);
    setFormData(prev => ({
      ...prev,
      provinceCode,
      provinceName: province?.name || '',
      cityCode: '',
      cityName: '',
      districtCode: '',
      districtName: '',
      subDistrictCode: '',
      subDistrictName: '',
    }));
  };

  // Handle city selection
  const handleCityChange = (cityCode: string) => {
    const city = citiesData?.data.find(c => c.cityCode === cityCode);
    setFormData(prev => ({
      ...prev,
      cityCode,
      cityName: city?.name || '',
      districtCode: '',
      districtName: '',
      subDistrictCode: '',
      subDistrictName: '',
    }));
  };

  // Handle district selection
  const handleDistrictChange = (districtCode: string) => {
    const district = districtsData?.data.find(d => d.districtCode === districtCode);
    setFormData(prev => ({
      ...prev,
      districtCode,
      districtName: district?.name || '',
      subDistrictCode: '',
      subDistrictName: '',
    }));
  };

  // Handle sub-district selection
  const handleSubDistrictChange = (subDistrictCode: string) => {
    const subDistrict = subDistrictsData?.data.find(sd => sd.subDistrictCode === subDistrictCode);
    setFormData(prev => ({
      ...prev,
      subDistrictCode,
      subDistrictName: subDistrict?.name || '',
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setToast({ message: 'Please fix the errors below', type: 'error' });
      return;
    }

    try {
      await createPatientMutation.mutateAsync(formData);
      setToast({ message: 'Patient created successfully!', type: 'success' });
      
      // Reset form
      setFormData({
        NIK: '',
        name: '',
        dob: '',
        birthPlace: '',
        gender: 'male',
        addressLine: '',
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        districtName: '',
        districtCode: '',
        subDistrictCode: '',
        subDistrictName: '',
        rt: '',
        rw: '',
        postalCode: '',
        phone: '',
        email: '',
        citizenshipStatus: 'WNI',
      });
      
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      let errorMessage = 'Failed to create patient';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        errorMessage = apiError.response?.data?.message || 'Failed to create patient';
      }
      
      setToast({ 
        message: errorMessage, 
        type: 'error' 
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Patient</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIK <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.NIK}
                  onChange={(e) => handleInputChange('NIK', e.target.value)}
                  placeholder="16-digit NIK"
                  maxLength={16}
                  className={errors.NIK ? 'border-red-500' : ''}
                />
                {errors.NIK && <span className="text-red-500 text-sm">{errors.NIK}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  className={errors.dob ? 'border-red-500' : ''}
                />
                {errors.dob && <span className="text-red-500 text-sm">{errors.dob}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Place <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                  placeholder="Enter birth place"
                  className={errors.birthPlace ? 'border-red-500' : ''}
                />
                {errors.birthPlace && <span className="text-red-500 text-sm">{errors.birthPlace}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Citizenship Status <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.citizenshipStatus}
                  onValueChange={(value) => handleInputChange('citizenshipStatus', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select citizenship status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WNI">WNI (Indonesian Citizen)</SelectItem>
                    <SelectItem value="WNA">WNA (Foreign Citizen)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Address Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.addressLine}
                  onChange={(e) => handleInputChange('addressLine', e.target.value)}
                  placeholder="Street address"
                  className={errors.addressLine ? 'border-red-500' : ''}
                />
                {errors.addressLine && <span className="text-red-500 text-sm">{errors.addressLine}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.provinceCode}
                  onValueChange={handleProvinceChange}
                  disabled={provincesLoading}
                >
                  <SelectTrigger className={`w-full ${errors.provinceCode ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provincesData?.data.map((province) => (
                      <SelectItem key={province.provinceCode} value={province.provinceCode}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.provinceCode && <span className="text-red-500 text-sm">{errors.provinceCode}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.cityCode}
                  onValueChange={handleCityChange}
                  disabled={citiesLoading || !formData.provinceCode}
                >
                  <SelectTrigger className={`w-full ${errors.cityCode ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {citiesData?.data.map((city) => (
                      <SelectItem key={city.cityCode} value={city.cityCode}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cityCode && <span className="text-red-500 text-sm">{errors.cityCode}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.districtCode}
                  onValueChange={handleDistrictChange}
                  disabled={districtsLoading || !formData.cityCode}
                >
                  <SelectTrigger className={`w-full ${errors.districtCode ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {districtsData?.data.map((district) => (
                      <SelectItem key={district.districtCode} value={district.districtCode}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.districtCode && <span className="text-red-500 text-sm">{errors.districtCode}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-District <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.subDistrictCode}
                  onValueChange={handleSubDistrictChange}
                  disabled={subDistrictsLoading || !formData.districtCode}
                >
                  <SelectTrigger className={`w-full ${errors.subDistrictCode ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select Sub-District" />
                  </SelectTrigger>
                  <SelectContent>
                    {subDistrictsData?.data.map((subDistrict) => (
                      <SelectItem key={subDistrict.subDistrictCode} value={subDistrict.subDistrictCode}>
                        {subDistrict.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subDistrictCode && <span className="text-red-500 text-sm">{errors.subDistrictCode}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RT <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.rt}
                    onChange={(e) => handleInputChange('rt', e.target.value)}
                    placeholder="RT"
                    className={errors.rt ? 'border-red-500' : ''}
                  />
                  {errors.rt && <span className="text-red-500 text-sm">{errors.rt}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RW <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.rw}
                    onChange={(e) => handleInputChange('rw', e.target.value)}
                    placeholder="RW"
                    className={errors.rw ? 'border-red-500' : ''}
                  />
                  {errors.rw && <span className="text-red-500 text-sm">{errors.rw}</span>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="Postal code"
                  className={errors.postalCode ? 'border-red-500' : ''}
                />
                {errors.postalCode && <span className="text-red-500 text-sm">{errors.postalCode}</span>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+62812345678"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="patient@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Reset form
                setFormData({
                  NIK: '',
                  name: '',
                  dob: '',
                  birthPlace: '',
                  gender: 'male',
                  addressLine: '',
                  provinceCode: '',
                  provinceName: '',
                  cityCode: '',
                  cityName: '',
                  districtName: '',
                  districtCode: '',
                  subDistrictCode: '',
                  subDistrictName: '',
                  rt: '',
                  rw: '',
                  postalCode: '',
                  phone: '',
                  email: '',
                  citizenshipStatus: 'WNI',
                });
                setErrors({});
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={createPatientMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createPatientMutation.isPending ? 'Creating...' : 'Create Patient'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
