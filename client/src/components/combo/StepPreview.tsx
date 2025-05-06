import React from 'react';
import { Golpe } from '@/lib/constants';
import GolpeTag from './GolpeTag';

interface StepPreviewProps {
  numeroEtapa: number;
  golpes: Golpe[];
}

const StepPreview: React.FC<StepPreviewProps> = ({ numeroEtapa, golpes }) => {
  if (golpes.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg bg-muted p-3">
      <div className="text-xs text-muted-foreground mb-2">Etapa {numeroEtapa}</div>
      <div className="flex flex-wrap gap-2">
        {golpes.map((golpe, index) => (
          <GolpeTag key={index} golpe={golpe} />
        ))}
      </div>
    </div>
  );
};

export default StepPreview;
