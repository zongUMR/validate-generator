import { validateErrorProps } from './index.d';

/**
 * Render validation error info from server-side response
 * @param{validateErrorProps} validateError - validation error response
 * @returns {React.ReactNode}
 **/
const RenderErrorInfo = ({
  validateError,
}: {
  validateError: validateErrorProps;
}) => {
  const { code = null, message, fields = {} } = validateError;
  if (!validateError.code) return null;
  return (
    <div className="renderErrorInfo">
      <h3 className="renderErrorInfo-message">错误消息: {message}</h3>
      <div>
        {code === 2 &&
          Object.entries(fields).map(item => {
            const [key, val] = item;
            return (
              <div className="renderErrorInfo-details" key={key}>
                <div className="renderErrorInfo-details-key">{key}: </div>
                <div className="renderErrorInfo-details-val">
                  {JSON.stringify(val)}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RenderErrorInfo;
