import { forwardRef } from 'react';
import type { CvData } from '../../types';
import { visibleSections } from '../../lib/sections';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { BoldTemplate } from './templates/BoldTemplate';

const TEMPLATE_MAP = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  bold: BoldTemplate,
};

export const CvPreview = forwardRef<HTMLDivElement, { cv: CvData }>(function CvPreview({ cv }, ref) {
  const Template = TEMPLATE_MAP[cv.template];
  const sections = visibleSections(cv);

  return (
    <div
      ref={ref}
      id="cv-print-area"
      className="mx-auto overflow-hidden rounded-md shadow-2xl shadow-black/40"
      style={
        {
          width: '210mm',
          minHeight: '297mm',
          '--cv-accent': cv.accentColor,
          fontSize: `${cv.fontScale}em`,
        } as React.CSSProperties
      }
    >
      <Template cv={cv} sections={sections} />
    </div>
  );
});
