import templateOne from './template_one.json';
import templateTwo from './template_two.json';
import templateThree from './template_three.json';
import templateFour from './template_four.json';
import templateFive from './template_five.json';
import templateSix from './template_six.json';

const templates: Record<string, any> = {
    "template_one": templateOne,
    "template_two": templateTwo,
    "template_three": templateThree,
    "template_four": templateFour,
    "template_five": templateFive,
    "template_six": templateSix,
    // Mapping "example" to one of them for backward compatibility if needed
    "example": templateOne
};

export default templates;
