import { useState, useEffect } from 'react';
import { Collapse } from 'antd';

import './App.css';
import { getSchemasData } from './api';
import { validateDataType } from 'app.d';
import FormWrapper from './component/FormWrapper';

const { Panel } = Collapse;

function App() {
  const [validateData, setValidateData] = useState<validateDataType[]>([]);

  useEffect(() => {
    // Fetch entities and plugins schemas from defined API
    getSchemasData(setValidateData);
  }, []);

  return (
    <div className="App">
      <h2>Validation Generaoter</h2>
      {validateData[0] && (
        <Collapse defaultActiveKey={validateData[0].name}>
          {validateData.map((item: validateDataType) => {
            return (
              <Panel header={`${item.type}: ${item.name}`} key={item.name}>
                <FormWrapper
                  type={item.type}
                  name={item.name}
                  data={item.data}
                />
              </Panel>
            );
          })}
        </Collapse>
      )}
    </div>
  );
}

export default App;
