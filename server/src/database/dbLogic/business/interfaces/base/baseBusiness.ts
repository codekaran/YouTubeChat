import { IRead } from './../common/Read';
import { IWrite } from '../common/Write';
export interface BaseBusiness<T> extends IRead<T>, IWrite<T> 
{
}
