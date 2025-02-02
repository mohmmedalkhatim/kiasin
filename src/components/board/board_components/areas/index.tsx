import { Element_postion } from '../../../../util/board/custom_grid'
import Card from '../../../Card'

function Areas ({label}:{label:Element_postion}) {
  return (
    <div className='area_grid'>
      <Card name={'welcome'} image={''} />
      <Card name={'welcome'} image={''} />
      <Card name={'welcome'} image={''} />
      <Card name={'welcome'} image={''} />
      <Card name={'welcome'} image={''} />
      <Card name={'welcome'} image={''} />
    </div>
  )
}
export default Areas
