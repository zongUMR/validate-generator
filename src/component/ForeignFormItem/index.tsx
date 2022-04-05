import { Select } from 'antd';
import { useState } from 'react';

import { getReferenceData } from '@/api';

const ForeignFormItem = ({ reference }: { reference: string }) => {
  const [options, setOptions] = useState<{ name: string; id: string }[]>([]);

  return (
    <Select
      allowClear
      onDropdownVisibleChange={open =>
        // Fetch referenced data for reference from backend when opening the select
        open && getReferenceData(reference, setOptions)
      }
    >
      {options.map(item => (
        <Select.Option key={item.id} value={item.id}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default ForeignFormItem;
