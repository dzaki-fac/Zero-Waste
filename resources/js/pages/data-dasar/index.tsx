import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, Edit3, FileDown, Leaf, MapPin, Save, X } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { baseUrl } from '@/lib/path';

type JenisSampahItem = {
    kategori: string;
    berat: number | string;
    periode: 'hari' | 'minggu';
};

type DataDasarType = {
    id: number | null;
    nama_tim: string;
    fakultas: string;
    alamat: string | null;
    penanggung_jawab: string;
    nomor_hp_email: string;
    tanggal_pengisian: string;
    jumlah_mahasiswa: number;
    jumlah_dosen: number;
    jumlah_tendik: number;
    jumlah_tenaga_pendukung: number;
    total_warga: number;
    luas_area_fakultas: number;
    luas_area_objek_lomba: number;
    baseline_sampah: number;
    baseline_sampah_periode: 'hari' | 'minggu';
    jenis_sampah_dominan: JenisSampahItem[];
    kondisi_fasilitas: string | null;
    sampah_residu_akhir: number;
    total_sampah_terkelola: number;
    jumlah_warga_terlibat_aktif: number;
    luas_area_zero_waste: number;
};

type RincianAreaDetail = {
    nama: string;
    deskripsi: string;
    luas: number;
};

type Props = {
    dataDasar: DataDasarType | null;
    rincianArea?: RincianAreaDetail[];
    computedBaseline?: { baseline_sampah: number; baseline_sampah_periode: string };
    computedJenisSampah?: JenisSampahItem[];
    computedSampahResidu?: number;
    computedTotalSampahTerkelola?: number;
};

const REQUIRED_FIELDS = [
    'nama_tim',
    'fakultas',
    'penanggung_jawab',
    'nomor_hp_email',
    'jumlah_mahasiswa',
    'jumlah_dosen',
    'luas_area_fakultas',
] as const;

export default function DataDasarIndex({ dataDasar, rincianArea: rincianAreaProp, computedBaseline, computedJenisSampah, computedSampahResidu, computedTotalSampahTerkelola }: Props) {
    const [isEditing, setIsEditing] = useState(!dataDasar);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama_tim: dataDasar?.nama_tim ?? '',
        fakultas: dataDasar?.fakultas ?? '',
        alamat: dataDasar?.alamat ?? '',
        penanggung_jawab: dataDasar?.penanggung_jawab ?? '',
        nomor_hp_email: dataDasar?.nomor_hp_email ?? '',
        tanggal_pengisian:
            dataDasar?.tanggal_pengisian ??
            new Date().toISOString().slice(0, 10),
        jumlah_mahasiswa: dataDasar?.jumlah_mahasiswa?.toString() ?? '',
        jumlah_dosen: dataDasar?.jumlah_dosen?.toString() ?? '',
        jumlah_tendik: dataDasar?.jumlah_tendik?.toString() ?? '',
        jumlah_tenaga_pendukung:
            dataDasar?.jumlah_tenaga_pendukung?.toString() ?? '',
        luas_area_fakultas: dataDasar?.luas_area_fakultas?.toString() ?? '',
        luas_area_objek_lomba:
            dataDasar?.luas_area_objek_lomba?.toString() ?? '',
        kondisi_fasilitas: dataDasar?.kondisi_fasilitas ?? '',
        jumlah_warga_terlibat_aktif:
            dataDasar?.jumlah_warga_terlibat_aktif?.toString() ?? '',
        luas_area_zero_waste:
            dataDasar?.luas_area_zero_waste?.toString() ?? '',
        rincian_area: [] as RincianAreaDetail[],
    });

    const [rincianArea, setRincianArea] = useState<RincianAreaDetail[]>([]);

    const jumlahMahasiswa = Number(data.jumlah_mahasiswa || 0);
    const jumlahDosen = Number(data.jumlah_dosen || 0);
    const jumlahTendik = Number(data.jumlah_tendik || 0);
    const jumlahTenagaPendukung = Number(data.jumlah_tenaga_pendukung || 0);
    const totalWarga =
        jumlahMahasiswa + jumlahDosen + jumlahTendik + jumlahTenagaPendukung;

    const baselineSampah = computedBaseline?.baseline_sampah ?? 0;
    const sampahResidu = computedSampahResidu ?? 0;
    const totalSampahTerkelola = computedTotalSampahTerkelola ?? 0;
    const jumlahWargaTerlibat = Number(data.jumlah_warga_terlibat_aktif || 0);
    const luasAreaZeroWaste = Number(data.luas_area_zero_waste || 0);
    const luasAreaFakultas = Number(data.luas_area_fakultas || 0);

    const hasilPenguranganSampah =
        baselineSampah
            ? ((baselineSampah - sampahResidu) / baselineSampah) * 100
            : null;
    const hasilSampahPerKapita = totalWarga
        ? totalSampahTerkelola / totalWarga
        : null;
    const hasilPartisipasi = totalWarga
        ? (jumlahWargaTerlibat / totalWarga) * 100
        : null;
    const hasilCakupanArea = luasAreaFakultas
        ? (luasAreaZeroWaste / luasAreaFakultas) * 100
        : null;

    const filledRequired = REQUIRED_FIELDS.filter(
        (f) => String(data[f] ?? '').trim() !== '',
    ).length;
    const completion = Math.round(
        (filledRequired / REQUIRED_FIELDS.length) * 100,
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(baseUrl('/admin/data-dasar'), {
            onSuccess: () => setIsEditing(false),
        });
    };

    const updateRincianArea = (i: number, field: keyof RincianAreaDetail, value: string | number) => {
        const copy = rincianArea.map((item, idx) =>
            idx === i ? { ...item, [field]: value } : item,
        );
        setRincianArea(copy);
        setData('rincian_area', copy);
    };

    const handleFormSubmit = () => {
        const form = document.getElementById(
            'data-dasar-form',
        ) as HTMLFormElement | null;
        form?.requestSubmit();
    };

    const enterEditMode = () => {
        if (rincianAreaProp) {
            setRincianArea(rincianAreaProp);
            setData('rincian_area', rincianAreaProp);
        }

        setIsEditing(true);
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    return (
        <>
            <Head title="Data Dasar" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-gradient-to-b from-green-50/40 to-transparent p-4 rounded-xl">
                {/* Header */}
                <div className="flex flex-col gap-4 rounded-2xl border border-green-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm sm:flex sm:h-12 sm:w-12">
                            <Leaf className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                            <Heading
                                title="Data Dasar"
                                description="Informasi dasar mengenai unit atau fakultas yang digunakan sebagai baseline program Zero Waste."
                            />
                            {!isEditing && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-green-100">
                                        <div
                                            className="h-full rounded-full bg-green-600 transition-all"
                                            style={{ width: `${completion}%` }}
                                        />
                                    </div>
                                    <span className="flex items-center gap-1 text-xs font-medium text-green-800">
                                        {completion === 100 && (
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        )}
                                        {completion}% lengkap
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    disabled={processing}
                                    type="button"
                                    onClick={handleFormSubmit}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Save className="h-4 w-4" />
                                    Simpan
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={processing}
                                    className="border-green-200 text-green-800 hover:bg-green-50"
                                >
                                    <X className="h-4 w-4" />
                                    Batal
                                </Button>
                            </>
                        ) : (
                            <>
                                {dataDasar && (
                                    <Button asChild variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                                        <a href={baseUrl('/admin/data-dasar/export')}>
                                            <FileDown className="h-4 w-4" />
                                            Export CSV
                                        </a>
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    onClick={enterEditMode}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Edit3 className="h-4 w-4" />
                                    Edit Data
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <form
                    id="data-dasar-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                >
                    {/* Rumus Penilaian */}
                    <SectionCard
                        icon={Leaf}
                        title="Rumus Penilaian"
                        subtitle="Indikator dan rumus yang digunakan dalam penilaian program Zero Waste"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-green-100 bg-green-50/60">
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-green-700 uppercase w-1/3">
                                            Indikator
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-green-700 uppercase">
                                            Rumus
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold tracking-wider text-green-700 uppercase w-28">
                                            Hasil
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-green-100">
                                    <tr className="hover:bg-green-50/30 transition-colors">
                                        <td className="px-6 py-3 text-sm font-medium text-green-900">
                                            Persentase Pengurangan Sampah
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <div className="leading-relaxed text-green-800">
                                                    <span className="text-green-600">(</span>{' '}
                                                    <span className="font-medium text-green-700">Baseline Sampah Awal: </span>
                                                    <span className="tabular-nums font-semibold text-green-900">{baselineSampah.toLocaleString('id-ID')}</span>{' '}
                                                    <span className="text-xs text-slate-500">kg</span>{' '}
                                                    <span className="text-green-600">-</span>{' '}
                                                    <span className="font-medium text-green-700">Sampah Residu Akhir: </span>
                                                    <span className="tabular-nums font-semibold text-green-900">{sampahResidu.toLocaleString('id-ID')}</span>{' '}
                                                    <span className="text-xs text-slate-500">kg</span>{' '}
                                                    <span className="text-green-600">) / </span>{' '}
                                                    <span className="font-medium text-green-700">Baseline Sampah Awal: </span>
                                                    <span className="tabular-nums font-semibold text-green-900">{baselineSampah.toLocaleString('id-ID')}</span>{' '}
                                                    <span className="text-xs text-slate-500">kg</span>{' '}
                                                    <span className="text-green-600">× 100%</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <span className="text-sm tabular-nums font-medium text-green-900">
                                                {hasilPenguranganSampah !== null ? `${hasilPenguranganSampah.toFixed(2)}%` : '-'}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-green-50/30 transition-colors">
                                        <td className="px-6 py-3 text-sm font-medium text-green-900">
                                            Sampah Terkelola per Kapita
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <div className="leading-relaxed text-green-800">
                                                    <span className="font-medium text-green-700">Total Sampah Terkelola: </span>
                                                    <span className="tabular-nums font-semibold text-green-900">{totalSampahTerkelola.toLocaleString('id-ID')}</span>{' '}
                                                    <span className="text-xs text-slate-500">kg</span>{' '}
                                                    <span className="text-green-600">/</span>{' '}
                                                    <span className="font-medium text-green-700">Total Warga Fakultas atau Unit: </span>
                                                    <span className="tabular-nums font-semibold text-green-900">{totalWarga.toLocaleString('id-ID')}</span>{' '}
                                                    <span className="text-xs text-slate-500">orang</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <span className="text-sm tabular-nums font-medium text-green-900">
                                                {hasilSampahPerKapita !== null ? hasilSampahPerKapita.toFixed(2) : '-'}
                                                <span className="text-xs text-slate-500"> kg/orang</span>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-green-50/30 transition-colors">
                                        <td className="px-6 py-3 text-sm font-medium text-green-900">
                                            Persentase Partisipasi
                                        </td>
                                        <td className="px-6 py-3">
                                            {isEditing ? (
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div className="leading-relaxed text-green-800">
                                                        <span className="font-medium text-green-700">Jumlah Warga yang Terlibat Aktif: </span>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            value={data.jumlah_warga_terlibat_aktif}
                                                            onChange={(e) =>
                                                                setData('jumlah_warga_terlibat_aktif', e.target.value)
                                                            }
                                                            className="inline-flex w-20 border-green-200 text-xs text-center focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                                            placeholder="0"
                                                        />{' '}
                                                        <span className="text-xs text-slate-500">orang</span>{' '}
                                                        <span className="text-green-600">/</span>{' '}
                                                        <span className="font-medium text-green-700">Total Warga Fakultas atau Unit: </span>
                                                        <span className="tabular-nums font-semibold text-green-900">{totalWarga.toLocaleString('id-ID')}</span>{' '}
                                                        <span className="text-xs text-slate-500">orang</span>{' '}
                                                        <span className="text-green-600">× 100%</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div className="leading-relaxed text-green-800">
                                                        <span className="font-medium text-green-700">Jumlah Warga yang Terlibat Aktif: </span>
                                                        <span className="tabular-nums font-semibold text-green-900">{data.jumlah_warga_terlibat_aktif || '0'}</span>{' '}
                                                        <span className="text-xs text-slate-500">orang</span>{' '}
                                                        <span className="text-green-600">/</span>{' '}
                                                        <span className="font-medium text-green-700">Total Warga Fakultas atau Unit: </span>
                                                        <span className="tabular-nums font-semibold text-green-900">{totalWarga.toLocaleString('id-ID')}</span>{' '}
                                                        <span className="text-xs text-slate-500">orang</span>{' '}
                                                        <span className="text-green-600">× 100%</span>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <span className="text-sm tabular-nums font-medium text-green-900">
                                                {hasilPartisipasi !== null ? `${hasilPartisipasi.toFixed(2)}%` : '-'}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-green-50/30 transition-colors">
                                        <td className="px-6 py-3 text-sm font-medium text-green-900">
                                            Cakupan Area Terkelola
                                        </td>
                                        <td className="px-6 py-3">
                                            {isEditing ? (
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div className="leading-relaxed text-green-800">
                                                        <span className="font-medium text-green-700">Luas Area yang Menerapkan Zero Waste: </span>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={data.luas_area_zero_waste}
                                                            onChange={(e) =>
                                                                setData('luas_area_zero_waste', e.target.value)
                                                            }
                                                            className="inline-flex w-20 border-green-200 text-xs text-center focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                                            placeholder="0"
                                                        />{' '}
                                                        <span className="text-xs text-slate-500">m²</span>{' '}
                                                        <span className="text-green-600">/</span>{' '}
                                                        <span className="font-medium text-green-700">Total Luas Area Fakultas atau Unit: </span>
                                                        <span className="tabular-nums font-semibold text-green-900">{data.luas_area_fakultas || '0'}</span>{' '}
                                                        <span className="text-xs text-slate-500">m²</span>{' '}
                                                        <span className="text-green-600">× 100%</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div className="leading-relaxed text-green-800">
                                                        <span className="font-medium text-green-700">Luas Area yang Menerapkan Zero Waste: </span>
                                                        <span className="tabular-nums font-semibold text-green-900">{data.luas_area_zero_waste || '0'}</span>{' '}
                                                        <span className="text-xs text-slate-500">m²</span>{' '}
                                                        <span className="text-green-600">/</span>{' '}
                                                        <span className="font-medium text-green-700">Total Luas Area Fakultas atau Unit: </span>
                                                        <span className="tabular-nums font-semibold text-green-900">{data.luas_area_fakultas || '0'}</span>{' '}
                                                        <span className="text-xs text-slate-500">m²</span>{' '}
                                                        <span className="text-green-600">× 100%</span>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <span className="text-sm tabular-nums font-medium text-green-900">
                                                {hasilCakupanArea !== null ? `${hasilCakupanArea.toFixed(2)}%` : '-'}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </SectionCard>

                    {/* Identitas Peserta */}
                    <SectionCard
                        icon={MapPin}
                        title="Identitas Peserta"
                        subtitle="Siapa yang bertanggung jawab atas data ini"
                    >
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-6 sm:grid-cols-2">
                            <FieldWrapper>
                                <Label
                                    htmlFor="nama_tim"
                                    className="text-sm font-medium text-green-800"
                                >
                                    Nama Tim / Unit{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            id="nama_tim"
                                            value={data.nama_tim}
                                            onChange={(e) =>
                                                setData(
                                                    'nama_tim',
                                                    e.target.value,
                                                )
                                            }
                                            className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                            placeholder="Masukkan nama tim atau unit"
                                        />
                                        <InputError message={errors.nama_tim} />
                                    </>
                                ) : (
                                    <ReadValue value={data.nama_tim} />
                                )}
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label
                                    htmlFor="fakultas"
                                    className="text-sm font-medium text-green-800"
                                >
                                    Fakultas / Unit{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            id="fakultas"
                                            value={data.fakultas}
                                            onChange={(e) =>
                                                setData(
                                                    'fakultas',
                                                    e.target.value,
                                                )
                                            }
                                            className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                            placeholder="Masukkan fakultas atau unit"
                                        />
                                        <InputError message={errors.fakultas} />
                                    </>
                                ) : (
                                    <ReadValue value={data.fakultas} />
                                )}
                            </FieldWrapper>

                            <div className="sm:col-span-2">
                                <FieldWrapper>
                                    <Label
                                        htmlFor="alamat"
                                        className="text-sm font-medium text-green-800"
                                    >
                                        Alamat / Lokasi Program
                                    </Label>
                                    {isEditing ? (
                                        <>
                                            <Input
                                                id="alamat"
                                                value={data.alamat}
                                                onChange={(e) =>
                                                    setData(
                                                        'alamat',
                                                        e.target.value,
                                                    )
                                                }
                                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                                placeholder="Masukkan alamat atau lokasi"
                                            />
                                            <InputError
                                                message={errors.alamat}
                                            />
                                        </>
                                    ) : (
                                        <ReadValue value={data.alamat} />
                                    )}
                                </FieldWrapper>
                            </div>

                            <FieldWrapper>
                                <Label
                                    htmlFor="penanggung_jawab"
                                    className="text-sm font-medium text-green-800"
                                >
                                    Penanggung Jawab{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            id="penanggung_jawab"
                                            value={data.penanggung_jawab}
                                            onChange={(e) =>
                                                setData(
                                                    'penanggung_jawab',
                                                    e.target.value,
                                                )
                                            }
                                            className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                            placeholder="Masukkan nama penanggung jawab"
                                        />
                                        <InputError
                                            message={errors.penanggung_jawab}
                                        />
                                    </>
                                ) : (
                                    <ReadValue value={data.penanggung_jawab} />
                                )}
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label
                                    htmlFor="nomor_hp_email"
                                    className="text-sm font-medium text-green-800"
                                >
                                    Nomor HP / Email{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            id="nomor_hp_email"
                                            value={data.nomor_hp_email}
                                            onChange={(e) =>
                                                setData(
                                                    'nomor_hp_email',
                                                    e.target.value,
                                                )
                                            }
                                            className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                            placeholder="Contoh: 08123456789 / email@example.com"
                                        />
                                        <InputError
                                            message={errors.nomor_hp_email}
                                        />
                                    </>
                                ) : (
                                    <ReadValue value={data.nomor_hp_email} />
                                )}
                            </FieldWrapper>

                            <FieldWrapper>
                                <Label
                                    htmlFor="tanggal_pengisian"
                                    className="text-sm font-medium text-green-800"
                                >
                                    Tanggal Pengisian
                                </Label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            id="tanggal_pengisian"
                                            type="date"
                                            value={data.tanggal_pengisian}
                                            onChange={(e) =>
                                                setData(
                                                    'tanggal_pengisian',
                                                    e.target.value,
                                                )
                                            }
                                            className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                        />
                                        <InputError
                                            message={errors.tanggal_pengisian}
                                        />
                                    </>
                                ) : (
                                    <ReadValue
                                        value={
                                            data.tanggal_pengisian
                                                ? new Date(
                                                      data.tanggal_pengisian +
                                                          'T00:00:00',
                                                  ).toLocaleDateString(
                                                      'id-ID',
                                                      {
                                                          day: 'numeric',
                                                          month: 'long',
                                                          year: 'numeric',
                                                      },
                                                  )
                                                : ''
                                        }
                                    />
                                )}
                            </FieldWrapper>
                        </div>
                    </SectionCard>

                    <div className="divide-y divide-green-100">
                        <div className="hidden bg-green-50/50 px-6 py-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
                            <span className="text-xs font-semibold tracking-wider text-green-700 uppercase">
                                Data
                            </span>
                            <span className="text-xs font-semibold tracking-wider text-green-700 uppercase">
                                Keterangan
                            </span>
                            <span className="text-xs font-semibold tracking-wider text-green-700 uppercase">
                                Isian
                            </span>
                        </div>

                        <DataRow
                            label="Jumlah Mahasiswa"
                            required
                            keterangan="Jumlah mahasiswa aktif pada fakultas/unit."
                            errors={errors.jumlah_mahasiswa}
                        >
                            {isEditing ? (
                                <NumberInput
                                    value={data.jumlah_mahasiswa}
                                    onChange={(v) =>
                                        setData('jumlah_mahasiswa', v)
                                    }
                                    suffix="orang"
                                />
                            ) : (
                                <DataValue
                                    value={data.jumlah_mahasiswa}
                                    suffix="orang"
                                />
                            )}
                        </DataRow>

                        <DataRow
                            label="Jumlah Dosen"
                            required
                            keterangan="Jumlah dosen aktif."
                            errors={errors.jumlah_dosen}
                        >
                            {isEditing ? (
                                <NumberInput
                                    value={data.jumlah_dosen}
                                    onChange={(v) =>
                                        setData('jumlah_dosen', v)
                                    }
                                    suffix="orang"
                                />
                            ) : (
                                <DataValue
                                    value={data.jumlah_dosen}
                                    suffix="orang"
                                />
                            )}
                        </DataRow>

                        <DataRow
                            label="Jumlah Tenaga Kependidikan"
                            keterangan="Jumlah tenaga kependidikan (tendik) aktif."
                            errors={errors.jumlah_tendik}
                        >
                            {isEditing ? (
                                <NumberInput
                                    value={data.jumlah_tendik}
                                    onChange={(v) =>
                                        setData('jumlah_tendik', v)
                                    }
                                    suffix="orang"
                                />
                            ) : (
                                <DataValue
                                    value={data.jumlah_tendik}
                                    suffix="orang"
                                />
                            )}
                        </DataRow>

                        <DataRow
                            label="Jumlah Tenaga Pendukung"
                            keterangan="Cleaning service, petugas kantin, satpam, teknisi, dan tenaga pendukung lain yang relevan."
                            errors={errors.jumlah_tenaga_pendukung}
                        >
                            {isEditing ? (
                                <NumberInput
                                    value={data.jumlah_tenaga_pendukung}
                                    onChange={(v) =>
                                        setData('jumlah_tenaga_pendukung', v)
                                    }
                                    suffix="orang"
                                />
                            ) : (
                                <DataValue
                                    value={data.jumlah_tenaga_pendukung}
                                    suffix="orang"
                                />
                            )}
                        </DataRow>

                        <DataRow
                            label="Total Warga Fakultas / Unit"
                            keterangan="Total mahasiswa + dosen + tenaga kependidikan + tenaga pendukung."
                            className="bg-green-50/40"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-base font-semibold tabular-nums text-green-900">
                                    {totalWarga.toLocaleString('id-ID')}
                                </span>
                                <span className="text-sm text-slate-600">
                                    orang
                                </span>
                                {isEditing && (
                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700 italic">
                                        otomatis
                                    </span>
                                )}
                            </div>
                        </DataRow>

                        <div className="col-span-3 bg-green-50/30 px-6 py-3">
                            <h4 className="text-xs font-semibold tracking-wider text-green-700 uppercase">
                                Rincian Luas Area per Klasifikasi
                            </h4>
                        </div>

                        {(isEditing ? rincianArea : (rincianAreaProp ?? [])).map((item, i) => (
                            <div
                                key={item.nama}
                                className="grid grid-cols-1 gap-2 px-6 py-3 sm:grid-cols-3 sm:items-center sm:gap-4"
                            >
                                <dt className="text-sm font-medium text-green-800">
                                    {item.nama}
                                </dt>
                                <dd className="text-xs leading-relaxed text-green-700">
                                    {isEditing ? (
                                        <Input
                                            value={item.deskripsi}
                                            onChange={(e) =>
                                                updateRincianArea(i, 'deskripsi', e.target.value)
                                            }
                                            className="h-9 text-sm border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                            placeholder="Deskripsi area"
                                        />
                                    ) : (
                                        item.deskripsi || (
                                            <span className="italic text-slate-400">-</span>
                                        )
                                    )}
                                </dd>
                                <dd>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            min={0}
                                            value={item.luas}
                                            onChange={(e) =>
                                                updateRincianArea(i, 'luas', Number(e.target.value))
                                            }
                                            className="h-9 w-28 text-right text-sm border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                        />
                                    ) : (
                                        <DataValue
                                            value={item.luas}
                                            suffix="m²"
                                        />
                                    )}
                                </dd>
                            </div>
                        ))}

                        <div className="col-span-3 border-t border-green-100" />

                        <div
                            className="grid grid-cols-1 gap-2 bg-green-50/40 px-6 py-3 sm:grid-cols-3 sm:gap-4"
                        >
                            <dt className="pt-0.5 text-sm font-semibold text-green-900">
                                Total Luas Area
                            </dt>
                            <dd className="text-xs leading-relaxed text-green-700">
                                Jumlah luas keseluruhan
                            </dd>
                            <dd>
                                <span className="text-sm font-semibold tabular-nums text-green-900">
                                    {(isEditing ? rincianArea : (rincianAreaProp ?? [])).reduce(
                                        (sum, item) =>
                                            sum + (Number(item.luas) || 0),
                                        0,
                                    ).toLocaleString('id-ID')}{' '}
                                    <span className="font-normal text-slate-600">
                                        m²
                                    </span>
                                </span>
                            </dd>
                        </div>

                        <div className="col-span-3 border-t border-green-100" />

                        <DataRow
                            label="Baseline Sampah Awal"
                            keterangan="Jumlah timbulan sampah sebelum program Zero Waste dalam satuan kg per hari atau kg per minggu."
                        >
                            <DataValue
                                value={computedBaseline?.baseline_sampah ?? 0}
                                suffix={`kg/${computedBaseline?.baseline_sampah_periode === 'minggu' ? 'minggu' : 'hari'}`}
                            />
                        </DataRow>

                        <DataRow
                            label="Jenis Sampah Dominan"
                            keterangan="Timbulan tiap jenis sampah dalam kg per hari atau kg per minggu."
                            stackOnMobile
                        >
                            <div className="divide-y divide-green-100 rounded-lg border border-green-100">
                                {(computedJenisSampah ?? []).length === 0 && (
                                    <div className="px-3 py-2 text-xs text-slate-500 italic">
                                        Belum ada data pemilahan.
                                    </div>
                                )}
                                {(computedJenisSampah ?? []).map(
                                    (item: JenisSampahItem) => (
                                        <div
                                            key={item.kategori}
                                            className="flex items-center gap-3 px-3 py-2"
                                        >
                                            <span className="w-28 shrink-0 text-xs font-medium text-green-800">
                                                {item.kategori}
                                            </span>
                                            <span className="text-sm tabular-nums text-green-900">
                                                {Number(
                                                    item.berat || 0,
                                                ).toLocaleString('id-ID')}{' '}
                                                kg
                                                <span className="text-slate-600">
                                                    {item.periode === 'hari'
                                                        ? '/hari'
                                                        : '/minggu'}
                                                </span>
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </DataRow>

                        <DataRow
                            label="Kondisi Fasilitas Awal"
                            keterangan="Fasilitas yang sudah tersedia sebelum program Zero Waste, seperti tempat pilah, komposter, bank sampah, TPS, poster edukasi, dsb."
                            stackOnMobile
                        >
                            {isEditing ? (
                                <>
                                    <Textarea
                                        value={data.kondisi_fasilitas}
                                        onChange={(e) =>
                                            setData(
                                                'kondisi_fasilitas',
                                                e.target.value,
                                            )
                                        }
                                        className="min-h-[120px] border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                        placeholder="Jelaskan fasilitas yang dimiliki saat ini..."
                                    />
                                    <InputError
                                        message={errors.kondisi_fasilitas}
                                    />
                                </>
                            ) : (
                                <p className="rounded-lg bg-green-50/50 p-3 text-sm whitespace-pre-wrap text-green-900">
                                    {data.kondisi_fasilitas || (
                                        <span className="text-slate-500 italic">
                                            Belum diisi
                                        </span>
                                    )}
                                </p>
                            )}
                        </DataRow>
                    </div>

                    <button type="submit" className="hidden" />
                </form>

                {/* Sticky save bar on mobile while editing */}
                {isEditing && (
                    <div className="sticky bottom-4 z-10 flex items-center justify-end gap-2 rounded-xl border border-green-100 bg-white/95 p-3 shadow-lg backdrop-blur sm:hidden">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleCancel}
                            disabled={processing}
                            className="flex-1 border-green-200 text-green-800"
                        >
                            <X className="h-4 w-4" />
                            Batal
                        </Button>
                        <Button
                            disabled={processing}
                            type="button"
                            onClick={handleFormSubmit}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                            <Save className="h-4 w-4" />
                            Simpan
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

/* --- Helper sub-components --- */

function SectionCard({
    icon: Icon,
    title,
    subtitle,
    children,
}: {
    icon: typeof Leaf;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-green-100 bg-green-50/40 px-6 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-800">
                    <Icon className="h-4.5 w-4.5" />
                </span>
                <div>
                    <h3 className="text-base font-semibold text-green-900">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-xs text-green-700">{subtitle}</p>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
}

function FieldWrapper({ children }: { children: React.ReactNode }) {
    return <div className="grid gap-1.5">{children}</div>;
}

function ReadValue({ value }: { value: string | null | undefined }) {
    return value ? (
        <p className="text-sm text-green-900">{value}</p>
    ) : (
        <p className="text-sm text-slate-500 italic">Belum diisi</p>
    );
}

function DataRow({
    label,
    children,
    required,
    errors,
    keterangan,
    className = '',
    stackOnMobile = false,
}: {
    label: string;
    children: React.ReactNode;
    required?: boolean;
    errors?: string | string[];
    keterangan?: string;
    className?: string;
    stackOnMobile?: boolean;
}) {
    return (
        <div
            className={`grid grid-cols-1 gap-2 px-6 py-4 transition-colors sm:grid-cols-3 sm:items-center sm:gap-4 ${
                stackOnMobile ? '' : ''
            } ${className}`}
        >
            <dt className="pt-1.5 text-sm font-medium text-green-800">
                {label}
                {required && <span className="ml-0.5 text-red-500">*</span>}
            </dt>
            {keterangan && (
                <dd className="text-xs leading-relaxed text-green-700 sm:pt-1.5">
                    {keterangan}
                </dd>
            )}
            <dd>
                {children}
                {errors && (
                    <InputError
                        message={
                            typeof errors === 'string'
                                ? errors
                                : errors.join(', ')
                        }
                    />
                )}
            </dd>
        </div>
    );
}

function DataValue({
    value,
    suffix,
}: {
    value: number | string;
    suffix: string;
}) {
    const num = Number(value);

    return value !== '' && value !== null && value !== undefined ? (
        <span className="text-sm font-medium tabular-nums text-green-900">
            {isNaN(num) ? value : num.toLocaleString('id-ID')}{' '}
            <span className="font-normal text-slate-600">{suffix}</span>
        </span>
    ) : (
        <span className="text-sm text-slate-500 italic">Belum diisi</span>
    );
}

function NumberInput({
    value,
    onChange,
    suffix,
}: {
    value: string;
    onChange: (val: string) => void;
    suffix: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <Input
                type="number"
                min="0"
                step="1"
                value={value}
                onChange={(e) => {
                    const v = e.target.value;

                    if (v === '' || Number(v) >= 0) {
                        onChange(v);
                    }
                }}
                className="w-28 border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                placeholder="0"
            />
            <span className="text-sm text-green-700">{suffix}</span>
        </div>
    );
}