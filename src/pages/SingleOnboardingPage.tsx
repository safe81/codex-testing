import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage, auth } from '../services/firebase';
import { interests } from '../data/interests'; // Assuming you have this file

interface IOnboardingForm {
  displayName: string;
  birthDate: string;
  gender: 'man' | 'woman' | 'other' | '';
  bio: string;
  profilePicture?: FileList;
  interests: string[];
}

const steps = [
  { id: '1', name: 'Informações Básicas' },
  { id: '2', name: 'Interesses' },
  { id: '3', name: 'Foto de Perfil' },
  { id: '4', name: 'Biografia' },
];

const SingleOnboardingPage: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<IOnboardingForm>({
    defaultValues: {
      displayName: '',
      birthDate: '',
      gender: '',
      bio: '',
      interests: [],
    }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);

  const onSubmit = async (data: IOnboardingForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    if (!user) {
      setSubmitError("Ocorreu um problema com a sessão. Faz login novamente.");
      setIsSubmitting(false);
      return;
    }

    try {
      let mainPhotoUrl: string | null = null;
      const profilePictureFile = data.profilePicture?.[0];

      if (profilePictureFile) {
        const photoRef = ref(storage, `profile-images/${user.uid}/main.jpg`);
        await uploadBytes(photoRef, profilePictureFile);
        mainPhotoUrl = await getDownloadURL(photoRef);
      }

      const profileData = {
        userId: user.uid,
        accountType: "USER",
        displayName: data.displayName,
        birthDate: data.birthDate,
        gender: data.gender,
        bio: data.bio,
        mainPhotoUrl: mainPhotoUrl,
        interests: data.interests,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "profiles", user.uid), profileData, { merge: true });

      navigate('/singles');

    } catch (err) {
      console.error("[ERROR ONBOARDING]", err);
      let errorMessage = "Ocorreu um erro inesperado ao gravar o perfil. Tente novamente.";
      if (err instanceof Error) {
        if (err.message.includes('storage/unauthorized')) {
          errorMessage = "Falha no upload da foto. Verifique as permissões ou tente outra foto.";
        } else {
          errorMessage = err.message;
        }
      }
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (userLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">A verificar sessão...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-50 py-12">
      <div className="w-full max-w-lg px-6">
        <h1 className="text-4xl font-bold text-center mb-4 text-white">Crie o seu Perfil</h1>
        <p className="text-center text-slate-400 mb-8">Passo {currentStep + 1} de {steps.length}: {steps[currentStep].name}</p>

        <div className="mb-8">
          <div className="bg-slate-700 rounded-full h-2">
            <div
              className="bg-rose-500 rounded-full h-2"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-slate-900/80 p-8 rounded-lg border border-slate-700">

          {currentStep === 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Informações Básicas</h2>
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium mb-1">Nome de Exibição</label>
                <Controller
                  name="displayName"
                  control={control}
                  rules={{ required: 'O nome é obrigatório' }}
                  render={({ field }) => <input id="displayName" {...field} className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2" />}
                />
                {errors.displayName && <p className="text-red-400 text-xs mt-1">{errors.displayName.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium mb-1">Data de Nascimento</label>
                  <Controller
                    name="birthDate"
                    control={control}
                    rules={{ required: 'A data de nascimento é obrigatória' }}
                    render={({ field }) => <input id="birthDate" type="date" {...field} className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2" />}
                  />
                  {errors.birthDate && <p className="text-red-400 text-xs mt-1">{errors.birthDate.message}</p>}
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium mb-1">Género</label>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: 'O género é obrigatório' }}
                    render={({ field }) => (
                      <select id="gender" {...field} className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2">
                        <option value="">Selecione...</option>
                        <option value="woman">Mulher</option>
                        <option value="man">Homem</option>
                        <option value="other">Outro</option>
                      </select>
                    )}
                  />
                  {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender.message}</p>}
                </div>
              </div>
            </section>
          )}

          {currentStep === 1 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Seus Interesses</h2>
              <Controller
                name="interests"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => {
                          const newValue = field.value.includes(interest.id)
                            ? field.value.filter((i) => i !== interest.id)
                            : [...field.value, interest.id];
                          field.onChange(newValue);
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${field.value.includes(interest.id)
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                      >
                        {interest.label}
                      </button>
                    ))}
                  </div>
                )}
              />
            </section>
          )}

          {currentStep === 2 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Foto de Perfil</h2>
              <div>
                <label htmlFor="profilePicture" className="block text-sm font-medium mb-1">Foto de Perfil (Opcional)</label>
                <Controller
                  name="profilePicture"
                  control={control}
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <input
                      id="profilePicture"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => onChange(e.target.files)}
                      onBlur={onBlur}
                      name={name}
                      ref={ref}
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-rose-500/80 hover:file:bg-rose-600"
                    />
                  )}
                />
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Biografia</h2>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-1">Sobre Mim (Bio)</label>
                <Controller
                  name="bio"
                  control={control}
                  rules={{ maxLength: { value: 500, message: 'Máximo de 500 caracteres' } }}
                  render={({ field }) => <textarea id="bio" {...field} rows={4} className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2" />}
                />
                {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>}
              </div>
            </section>
          )}

          {submitError && (
            <p className="mb-3 text-sm text-red-400 bg-red-900/30 border border-red-500/40 rounded-lg px-3 py-2 text-center">
              {submitError}
            </p>
          )}

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <button type="button" onClick={prevStep} className="px-6 py-2 rounded-full font-semibold bg-slate-600 hover:bg-slate-500">
                Anterior
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button type="button" onClick={nextStep} className="px-6 py-2 rounded-full font-semibold bg-rose-500 hover:bg-rose-600">
                Próximo
              </button>
            )}
            {currentStep === steps.length - 1 && (
              <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 rounded-full font-semibold text-lg transition-all transform disabled:opacity-50 disabled:cursor-not-allowed bg-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-[0_0_20px_rgba(244,63,94,0.6)]">
                {isSubmitting ? 'A gravar perfil...' : 'Guardar Perfil'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SingleOnboardingPage;