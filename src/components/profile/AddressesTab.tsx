import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiHome, FiBriefcase, FiMapPin, FiPlus,
    FiEdit2, FiTrash2, FiStar,
    FiX, FiNavigation
} from 'react-icons/fi';
import {
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    clearAddressState
} from '@/redux/slices/addressSlice';
import type { RootState, AppDispatch } from '@/redux';
import type { Address } from '@/types';
import { toastService } from '@/services/toastService';

const AddressesTab = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { addresses, loading, error, success } = useSelector((state: RootState) => state.address);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const [form, setForm] = useState({
        label: 'Home',
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
    });

    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            toastService.success(editingAddress ? 'Address updated!' : 'Address added!');
            setIsFormOpen(false);
            setEditingAddress(null);
            dispatch(clearAddressState());
            resetForm();
        }
        if (error) {
            toastService.error(error);
            dispatch(clearAddressState());
        }
    }, [success, error, dispatch, editingAddress]);

    const resetForm = () => {
        setForm({
            label: 'Home',
            name: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India',
            isDefault: false
        });
    };

    const handleEdit = (addr: Address) => {
        setEditingAddress(addr);
        setForm({
            label: addr.label || 'Home',
            name: addr.name,
            phone: addr.phone,
            addressLine1: addr.addressLine1,
            addressLine2: addr.addressLine2 || '',
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            country: addr.country,
            isDefault: addr.isDefault
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await dispatch(deleteAddress(id)).unwrap();
                toastService.success('Address deleted');
            } catch (err: any) {
                toastService.error(err || 'Failed to delete address');
            }
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await dispatch(setDefaultAddress(id)).unwrap();
            toastService.success('Default address updated');
        } catch (err: any) {
            toastService.error(err || 'Failed to set default');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                await dispatch(updateAddress({ id: editingAddress._id, data: form as any })).unwrap();
            } else {
                await dispatch(addAddress(form as any)).unwrap();
            }
        } catch (err: any) {
            // Error handled by useEffect
        }
    };

    const getLabelIcon = (label: string) => {
        switch (label.toLowerCase()) {
            case 'home': return <FiHome size={14} />;
            case 'office':
            case 'work': return <FiBriefcase size={14} />;
            default: return <FiMapPin size={14} />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">Saved Addresses</h2>
                    <p className="text-[#aaa] text-sm mt-0.5">Manage your shipping destinations</p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={() => { resetForm(); setIsFormOpen(true); }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white text-xs font-bold tracking-wide rounded-xl hover:bg-[#333] transition-all shadow-lg shadow-black/10"
                    >
                        <FiPlus className="w-4 h-4" />
                        Add New Address
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isFormOpen ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-3xl border border-[#f0eeec] shadow-sm overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="flex items-center justify-between mb-8 border-b border-[#f8f7f5] pb-6">
                                <h3 className="text-lg font-bold text-[#1a1a1a]">
                                    {editingAddress ? 'Modify Architecture' : 'Inaugurate New Address'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => { setIsFormOpen(false); setEditingAddress(null); }}
                                    className="p-2 hover:bg-[#f8f7f5] rounded-full text-[#aaa] transition-colors"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Label Selection */}
                                <div className="col-span-full">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-3">Address Designation</label>
                                    <div className="flex gap-3">
                                        {['Home', 'Office', 'Other'].map((l) => (
                                            <button
                                                key={l}
                                                type="button"
                                                onClick={() => setForm({ ...form, label: l })}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border transition-all
                                                    ${form.label === l
                                                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-md'
                                                        : 'bg-white text-[#666] border-[#f0eeec] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                                                    }`}
                                            >
                                                {getLabelIcon(l)}
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa]">Recipient Identity</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Full Name"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm border border-[#f0eeec] focus:border-[#1a1a1a] outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa]">Secure Contact</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm border border-[#f0eeec] focus:border-[#1a1a1a] outline-none transition-all"
                                    />
                                </div>

                                <div className="col-span-full space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa]">Primary Coordinates</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Street, House No, Building"
                                        value={form.addressLine1}
                                        onChange={e => setForm({ ...form, addressLine1: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm border border-[#f0eeec] focus:border-[#1a1a1a] outline-none transition-all"
                                    />
                                </div>

                                <div className="col-span-full space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa]">Secondary Details (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Apartment, Floor, Landmark"
                                        value={form.addressLine2}
                                        onChange={e => setForm({ ...form, addressLine2: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm border border-[#f0eeec] focus:border-[#1a1a1a] outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa]">Metropolitan Area</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="City"
                                        value={form.city}
                                        onChange={e => setForm({ ...form, city: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm border border-[#f0eeec] focus:border-[#1a1a1a] outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa]">State / Province</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="State"
                                        value={form.state}
                                        onChange={e => setForm({ ...form, state: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm border border-[#f0eeec] focus:border-[#1a1a1a] outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa]">Postal Logistics Code</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="PIN Code"
                                        value={form.postalCode}
                                        onChange={e => setForm({ ...form, postalCode: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm border border-[#f0eeec] focus:border-[#1a1a1a] outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa]">Territorial Registry</label>
                                    <input
                                        required
                                        type="text"
                                        value={form.country}
                                        onChange={e => setForm({ ...form, country: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm border border-[#f0eeec] focus:border-[#1a1a1a] outline-none transition-all"
                                    />
                                </div>

                                <div className="col-span-full pt-4">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={form.isDefault}
                                                onChange={e => setForm({ ...form, isDefault: e.target.checked })}
                                                className="sr-only"
                                            />
                                            <div className={`w-10 h-5 rounded-full transition-colors ${form.isDefault ? 'bg-[#1a1a1a]' : 'bg-[#e0e0e0]'}`} />
                                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${form.isDefault ? 'translate-x-5' : ''}`} />
                                        </div>
                                        <span className="text-xs font-bold text-[#666] group-hover:text-[#1a1a1a] transition-colors">Establish as Primary Destination</span>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-[#f8f7f5] flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setIsFormOpen(false); setEditingAddress(null); }}
                                    className="px-8 py-3 text-[#666] text-xs font-bold hover:text-[#1a1a1a] transition-colors"
                                >
                                    Abandon
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-10 py-3 bg-[#1a1a1a] text-white text-xs font-bold tracking-widest rounded-xl hover:bg-[#333] transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : editingAddress ? 'Confirm Refinement' : 'Finalize Addition'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {loading && addresses.length === 0 ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="h-48 bg-white rounded-3xl border border-[#f0eeec] animate-pulse" />
                            ))
                        ) : addresses.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-[#f0eeec] border-dashed">
                                <div className="w-16 h-16 bg-[#f8f7f5] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#ccc]">
                                    <FiNavigation size={30} />
                                </div>
                                <h3 className="text-lg font-bold text-[#1a1a1a]">No Coordinates Saved</h3>
                                <p className="text-[#aaa] text-sm max-w-xs mx-auto mt-1">Your saved locations will appear here for expedited acquisitions.</p>
                            </div>
                        ) : (
                            addresses.map((address) => (
                                <div
                                    key={address._id}
                                    className={`group relative bg-white rounded-3xl border transition-all duration-300 p-6 md:p-8 hover:shadow-xl hover:shadow-black/[0.02] 
                                        ${address.isDefault ? 'border-[#1a1a1a] ring-1 ring-[#1a1a1a]' : 'border-[#f0eeec] hover:border-[#ddd]'}`}
                                >
                                    {address.isDefault && (
                                        <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-[#1a1a1a] text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                                            <FiStar size={10} className="fill-white" />
                                            Primary
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4 mb-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                                            ${address.isDefault ? 'bg-[#1a1a1a] text-white' : 'bg-[#f8f7f5] text-[#aaa] group-hover:bg-[#1a1a1a] group-hover:text-white'}`}>
                                            {getLabelIcon(address.label || 'Home')}
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#ccc] group-hover:text-[#1a1a1a] transition-colors">
                                                {address.label || 'Home'}
                                            </span>
                                            <h4 className="text-base font-bold text-[#1a1a1a] mt-0.5">{address.name}</h4>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 text-sm text-[#666] mb-8 leading-relaxed">
                                        <p className="font-medium text-[#1a1a1a]">{address.addressLine1}</p>
                                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                                        <p>{address.city}, {address.state} {address.postalCode}</p>
                                        <p className="text-xs tracking-wide">{address.country}</p>
                                        <p className="text-xs font-bold text-[#1a1a1a] pt-2 flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-[#ccc]" />
                                            +91 {address.phone}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 pt-6 border-t border-[#f8f7f5]">
                                        {!address.isDefault && (
                                            <button
                                                onClick={() => handleSetDefault(address._id)}
                                                className="text-[10px] font-bold text-[#666] hover:text-[#1a1a1a] transition-colors flex items-center gap-1.5"
                                            >
                                                Make Primary
                                            </button>
                                        )}
                                        <div className="ml-auto flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(address)}
                                                className="p-2.5 rounded-xl hover:bg-[#f8f7f5] text-[#1a1a1a] transition-colors"
                                            >
                                                <FiEdit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(address._id)}
                                                className="p-2.5 rounded-xl hover:bg-red-50 text-red-400 transition-colors"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AddressesTab;
